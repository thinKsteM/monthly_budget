# Xcodeで実機確認するまでの手順

## Context
Capacitor iOS プロジェクト（静的SPA）を Xcode で開いて実機（iPhone）で動作確認したい。
Webのビルドステップは不要（`www/` に静的ファイルが既にある）。

## 前提条件（ユーザー側で必要なもの）
- Xcode がインストール済み
- Apple ID（無料でOK、ただし7日間の署名制限あり）
- iPhone が USB で Mac に接続されている
- iPhone 側で「デベロッパモード」が有効（設定 > プライバシーとセキュリティ > デベロッパモード）

## 手順

### Step 1: node_modules インストール（あーしが実行）
```bash
cd /Users/mikita/Desktop/dev/monthly_budget
npm install
```

### Step 2: Capacitor sync（あーしが実行）
Web資産をiOSプロジェクトにコピー＆ネイティブ依存を同期する。
```bash
npx cap sync ios
```

### Step 3: Xcodeでプロジェクトを開く（あーしが実行）
```bash
npx cap open ios
```
→ `ios/App/App.xcworkspace` が Xcode で開く

### Step 4: 署名設定（ユーザーが Xcode 上で操作）
1. Xcode 左のナビゲーターで **App** プロジェクト → **App** ターゲットを選択
2. **Signing & Capabilities** タブを開く
3. **Team** に自分の Apple ID を設定（なければ「Add Account...」から追加）
4. **Bundle Identifier** は必要に応じて Xcode 上で変更（`com.example.monthlybudget` のまま動かない場合）

### Step 5: 実機を選択して実行（ユーザーが Xcode 上で操作）
1. Xcode 上部のデバイス選択から接続中の iPhone を選択
2. **▶ Run** ボタン（またはCmd+R）を押す
3. 初回は iPhone 側で「信頼」の操作が必要：
   - iPhone の「設定 > 一般 > VPNとデバイス管理」から開発者を信頼する

## 対象ファイル
- [capacitor.config.ts](capacitor.config.ts) - Capacitor設定
- [package.json](package.json) - 依存管理
- [ios/App/](ios/App/) - iOSプロジェクト

## 検証方法
- iPhone 上でアプリ「月次収支管理」が起動し、予算管理画面が表示されればOK
