# 外国語暗唱アプリ
外国語のスピーキング力を鍛える際、最も効率的な方法の一つである「暗唱」。  
本アプリは暗唱文をフラッシュカード形式でペーパーレス方式で学ぶことができます。

## 開発の背景と本アプリの特徴
単語や熟語など、短い語を暗記するアプリケーションは多々ありますが、「暗唱」に特化したアプリケーションは未だありません。  
本アプリケーションは、LLMによって文章をワンクリックでフォーマル化、インフォーマル化するなどの機能を備え、従来の紙ベースのフラッシュカードよりも効率的な学習が可能です。

## URL
https://portfolio-r8j7kwo50-gravityhorse86-2226s-projects.vercel.app/signin

## デモアカウント
- ID：test1234
- パスワード：test1234

## 主な機能
- フラッシュカード表示機能
- フラッシュカードの入力、変更、登録機能
- AIによる文章の自動修正（フォーマル化、インフォーマル化）機能
- 覚えた数を視覚的に表示する機能
- 1ヶ月内に覚えた数によってキャラクターが進化していく機能 

## 使用した技術
- フルスタックフレームワーク：Next.js
- フロントエンド：HTML5, CSS3(TailWind CSS), React
- バックエンド：Supabase, Prisma
- デプロイ：Vercel

## 画面イメージ

### ログイン
<img width="308" height="377" alt="image" src="https://github.com/user-attachments/assets/83e15d6f-436b-46ae-a2f1-260c2ca5c3e4" />

### 新規登録
<img width="300" height="401" alt="image" src="https://github.com/user-attachments/assets/6524e8b0-9185-42c0-bb5d-5a953a1868ef" />

### マイページ
<img width="613" height="409" alt="image" src="https://github.com/user-attachments/assets/5010d0da-ef99-4f27-a766-65cedeeac7b3" />

#### キャラクター進化の例(落ち武者→堅牢な戦士）  
1ヶ月間の「覚えた」ボタンを押した数で判定<br>
<img width="136" height="119" alt="image" src="https://github.com/user-attachments/assets/77e0e647-bf2b-44fa-b37b-690dec7d4642" />
<img width="134" height="120" alt="image" src="https://github.com/user-attachments/assets/8434ce74-b6df-47c7-b315-56af48058411" />

### フラッシュカード設定（モーダル）
<img width="451" height="403" alt="image" src="https://github.com/user-attachments/assets/a1ef7766-c564-46f4-b008-02274afb792f" />

### フラッシュカード（おもて）
<img width="617" height="391" alt="image" src="https://github.com/user-attachments/assets/51af941d-2c94-4056-859d-63d7f6d867b8" />

### フラッシュカード（うら）
<img width="544" height="389" alt="image" src="https://github.com/user-attachments/assets/fd80eb51-d6f4-494a-bdc6-275711a318e9" />

### 登録情報設定
<img width="362" height="392" alt="image" src="https://github.com/user-attachments/assets/5378be38-5739-4fbb-879a-cf873fc0f530" />

## 今後の実装予定
今後は、LLMとの連携で学習をより楽しく、効率的に進められるよう、以下のような実装を考えている。
- AIにより、類似するシチュエーションや、言い回しを変えた暗唱文の提示<br>
    →「昨日、雨が降った」と入力すれば、「明日は、雨が降るだろうか？」のように、<br>
    「雨が降る」という一つのシチュエーションをベースに、時制や主語、疑問や否定などの文の要素を少しずつ変えた、<br>
    「変化球」の文章を提示してくれる。
- Text to SpeechのAPIを用い、暗唱文を音声朗読する機能の実装
- SupabaseでRLSの設定をし、セキュリティの安全性を高める

