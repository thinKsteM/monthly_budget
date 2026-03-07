# Header被り修正 & Enterキーで項目追加

## Context
iOSネイティブアプリとして動作する際、ステータスバー（時刻・キャリア表示）とアプリのHeaderが重なってしまっている。また、金額入力後にEnterキーで項目を追加できるようにしたい。

## 対象ファイル
- `www/index.html` (全変更はこの1ファイルのみ)

## 変更1: Headerのステータスバー被り修正

**行111** の `.header` の `padding` を変更:

```css
/* Before */
padding: 20px;

/* After */
padding: calc(20px + env(safe-area-inset-top)) 20px 20px 20px;
```

`env(safe-area-inset-bottom)` は既にアプリ内で使用済み（行558, 607, 1180）なので、同じパターンをtopに適用。非iOS環境では `env(safe-area-inset-top)` は `0px` になるため影響なし。

## 変更2: Enterキーで項目追加

**行2492の後**（`add-income-btn` のクリックハンドラの後、`});` の前）に以下を挿入:

```javascript
document.getElementById('expense-amount').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        document.getElementById('add-expense-btn').click();
    }
});

document.getElementById('income-amount').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        document.getElementById('add-income-btn').click();
    }
});
```

既存のボタンクリックハンドラを `.click()` で再利用し、ロジックの重複を避ける。

## 検証方法
1. iOSシミュレータまたは実機でアプリを起動し、Headerがステータスバーと被らないことを確認
2. 収入・支出の金額入力欄でEnterキーを押して項目が追加されることを確認
3. ブラウザでも表示が崩れないことを確認
