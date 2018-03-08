import firebase from 'firebase';

const config = {
    apiKey: 'AIzaSyCHe8hWpeFRJAP9hpnOOQvxJxYYl5AQQRQ',
    authDomain: 'react-portfolio-848df.firebaseapp.com',
    databaseURL: 'https://react-portfolio-848df.firebaseio.com',
    projectId: 'react-portfolio-848df',
    storageBucket: '',
    messagingSenderId: '1066467992058'
};

firebase.initializeApp(config);
export default firebase;
