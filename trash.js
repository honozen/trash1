import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import firebase from 'firebase/app';

const auth = getAuth(firebaseApp);
onAuthStateChanged(auth, user => {
  // Check for user status
});

// Firebaseの初期化設定
const firebaseConfig = {
    apiKey: "AIzaSyBzU4PSoveAAMrTBeyUn2wxCdfMOSFHk4U",
    authDomain: "trash-cans-in-tokyo-b3564.firebaseapp.com",
    projectId: "trash-cans-in-tokyo-b3564",
    storageBucket: "trash-cans-in-tokyo-b3564.appspot.com",
    messagingSenderId: "15884318826",
    appId: "1:15884318826:web:4b741e92b8e32d28d23213",
    measurementId: "G-SQRZB01Z9H"
  };
  
  // Firebaseを初期化
  const app = firebase.initializeApp(firebaseConfig);
  
  // Firebase Storageへの参照を取得
  const storage = firebase.storage();

  // Firestoreを使用可能にする
  const db = firebase.firestore()
    
  // フォームの送信イベントリスナー
  const form = document.getElementById('TrashForm');
  form.addEventListener('submit', async function (e) {
    e.preventDefault(); // デフォルトのフォーム送信を防ぐ
  
    // フォームの値を取得
    const location = document.getElementById('location').value;
    const condition = document.getElementById('condition').value;
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;
    const burnableGarbage = document.getElementById('burnableGarbage').checked;
    const nonBurnableGarbage = document.getElementById('nonBurnableGarbage').checked;
    const recyclable = document.getElementById('recyclable').checked;
    const photoFile = document.getElementById('photo').files[0];

    // まず、写真を Firebase Storage にアップロード
    const storageRef = storage.ref().child(`photos/${photoFile.name}`);
    await storageRef.put(photoFile);

    // アップロード後、写真のダウンロードURLを取得
    const photoURL = await storageRef.getDownloadURL();

    try {
        // まず "trashcans" ドキュメントへの参照を取得
        const trashcansDocRef = await db.collection('trashcans').doc('trashcans').get();

        // "trashcans" ドキュメント内に新しいコレクションを作成
        const collectionName = "trashcan_" + Date.now(); // タイムスタンプを使用

        // 新しいコレクションを作成
        const newCollectionRef = db.collection('trashcans').doc('trashcans').collection(collectionName);

        // Firestoreにデータを追加
        const docRef = await newCollectionRef.add({
            location,
            condition,
            latitude,
            longitude,
            burnableGarbage,
            nonBurnableGarbage,
            recyclable,
            photoURL, // 写真のダウンロードURLを保存
        });

        console.log('Document written with ID: ', docRef.id);

        // フォームをリセット
        form.reset();
    } 
    catch (error) {
        console.error('Error adding document: ', error);
    }

  });
  
