import os
import torch
import torch.nn as nn

# ============================================================
# DEPTHWISE SEPARABLE CONVOLUTION
# ============================================================

class DepthwiseSeparableConv(nn.Module):
    def __init__(self, in_channels, out_channels, stride=1):
        super().__init__()
        self.depthwise = nn.Conv2d(
            in_channels,
            in_channels,
            kernel_size=3,
            stride=stride,
            padding=1,
            groups=in_channels,
            bias=False
        )
        self.bn1 = nn.BatchNorm2d(in_channels)
        self.pointwise = nn.Conv2d(
            in_channels,
            out_channels,
            kernel_size=1,
            bias=False
        )
        self.bn2 = nn.BatchNorm2d(out_channels)
        self.relu = nn.ReLU(inplace=True)

    def forward(self, x):
        x = self.depthwise(x)
        x = self.bn1(x)
        x = self.relu(x)
        x = self.pointwise(x)
        x = self.bn2(x)
        x = self.relu(x)
        return x


# ============================================================
# MULTI-SCALE FEATURE EXTRACTION
# ============================================================

class MultiScaleFeatureModule(nn.Module):
    def __init__(self, in_channels, out_channels):
        super().__init__()
        branch_channels = out_channels // 3

        self.branch3x3 = nn.Sequential(
            nn.Conv2d(in_channels, branch_channels, kernel_size=3, padding=1, bias=False),
            nn.BatchNorm2d(branch_channels),
            nn.ReLU(inplace=True)
        )

        self.branch5x5 = nn.Sequential(
            nn.Conv2d(in_channels, branch_channels, kernel_size=5, padding=2, bias=False),
            nn.BatchNorm2d(branch_channels),
            nn.ReLU(inplace=True)
        )

        self.branch_dilated = nn.Sequential(
            nn.Conv2d(in_channels, branch_channels, kernel_size=3, padding=2, dilation=2, bias=False),
            nn.BatchNorm2d(branch_channels),
            nn.ReLU(inplace=True)
        )

        self.fusion = nn.Sequential(
            nn.Conv2d(branch_channels * 3, out_channels, kernel_size=1, bias=False),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(inplace=True)
        )

    def forward(self, x):
        b1 = self.branch3x3(x)
        b2 = self.branch5x5(x)
        b3 = self.branch_dilated(x)
        x = torch.cat([b1, b2, b3], dim=1)
        return self.fusion(x)


# ============================================================
# CHANNEL ATTENTION
# ============================================================

class ChannelAttention(nn.Module):
    def __init__(self, channels, reduction=8):
        super().__init__()
        reduced_channels = max(channels // reduction, 4)
        self.avg_pool = nn.AdaptiveAvgPool2d(1)
        self.max_pool = nn.AdaptiveMaxPool2d(1)

        self.mlp = nn.Sequential(
            nn.Conv2d(channels, reduced_channels, kernel_size=1, bias=False),
            nn.ReLU(inplace=True),
            nn.Conv2d(reduced_channels, channels, kernel_size=1, bias=False)
        )
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        avg_out = self.mlp(self.avg_pool(x))
        max_out = self.mlp(self.max_pool(x))
        attention = self.sigmoid(avg_out + max_out)
        return x * attention


# ============================================================
# SPATIAL ATTENTION
# ============================================================

class SpatialAttention(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv = nn.Conv2d(2, 1, kernel_size=7, padding=3, bias=False)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        avg_out = torch.mean(x, dim=1, keepdim=True)
        max_out, _ = torch.max(x, dim=1, keepdim=True)
        attention = torch.cat([avg_out, max_out], dim=1)
        attention = self.sigmoid(self.conv(attention))
        return x * attention


# ============================================================
# ATTENTION MODULE (CBAM)
# ============================================================

class AttentionModule(nn.Module):
    def __init__(self, channels):
        super().__init__()
        self.channel_attention = ChannelAttention(channels)
        self.spatial_attention = SpatialAttention()

    def forward(self, x):
        x = self.channel_attention(x)
        x = self.spatial_attention(x)
        return x


# ============================================================
# AMSF-NET
# ============================================================

class AMSFNet(nn.Module):
    """
    Adaptive Multi-Scale Feature Fusion Network (AMSF-Net)
    Trained weights: best_amsfnet_exp2.pth
    Classes: Deer, Tiger, Wolf
    Input: 224x224 RGB
    """
    def __init__(self, num_classes=3):
        super().__init__()
        self.stem = nn.Sequential(
            nn.Conv2d(3, 16, kernel_size=3, stride=2, padding=1, bias=False),
            nn.BatchNorm2d(16),
            nn.ReLU(inplace=True)
        )
        self.feature_block1 = DepthwiseSeparableConv(16, 32, stride=2)
        self.feature_block2 = DepthwiseSeparableConv(32, 64, stride=2)
        self.feature_block3 = DepthwiseSeparableConv(64, 96, stride=2)
        self.multiscale = MultiScaleFeatureModule(96, 96)
        self.attention = AttentionModule(96)
        self.global_pool = nn.AdaptiveAvgPool2d(1)
        self.dropout = nn.Dropout(0.30)
        self.classifier = nn.Linear(96, num_classes)

    def forward(self, x):
        x = self.stem(x)
        x = self.feature_block1(x)
        x = self.feature_block2(x)
        x = self.feature_block3(x)
        x = self.multiscale(x)
        x = self.attention(x)
        x = self.global_pool(x)
        x = torch.flatten(x, 1)
        x = self.dropout(x)
        return self.classifier(x)


def get_model(weights_path=None, num_classes=3, device="cpu"):
    """
    Instantiates AMSF-Net and safely loads trained checkpoint weights if available.
    """
    model = AMSFNet(num_classes=num_classes)
    if weights_path and torch.cuda.is_available():
        device = "cuda"
    model.to(device)

    if weights_path and os.path.exists(weights_path):
        try:
            checkpoint = torch.load(weights_path, map_location=device)
            # Handle checkpoint dict with 'model_state_dict'
            if isinstance(checkpoint, dict) and "model_state_dict" in checkpoint:
                state_dict = checkpoint["model_state_dict"]
            else:
                state_dict = checkpoint

            model.load_state_dict(state_dict)
            print(f"[AMSF-Net] Successfully loaded trained weights from {weights_path}")
        except Exception as e:
            print(f"[AMSF-Net] Notice: Could not load exact state_dict: {e}. Model initialized.")
    elif weights_path:
        print(f"[AMSF-Net] Weights file {weights_path} not found. Running in initialized state.")

    model.eval()
    return model
