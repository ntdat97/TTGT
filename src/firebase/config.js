import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyD2lt3a0XYPbDjrLQ67FAG8OfeVaaKkb94',
  authDomain: 'ttgt-d9edb.firebaseapp.com',
  databaseURL: 'https://ttgt-d9edb.firebaseio.com/',
  projectId: 'ttgt-d9edb',
  messagingSenderId: '85166340883',
  appId: '1:85166340883:android:fac9284354cec5fa5bf8e6',
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };