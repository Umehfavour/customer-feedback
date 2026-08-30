/* ==========================================================================
   Firebase configuration
      --------------------------------------------------------------------------
         1. Go to https://console.firebase.google.com → create a project (free).
            2. In the project, click the "</>" (web app) icon to register a web app.
               3. Firebase will show you a config object — copy those exact values in
                     below, replacing everything that says "YOUR_...".
                        4. In the left sidebar, go to Build → Firestore Database → Create
                              database → start in test mode (fine for getting started; see the
                                    README notes about locking it down later).
                                       These values are safe to publish in a public repo — they identify your
                                          project, they are not secret keys. Access is controlled separately by
                                             Firestore Security Rules (Build → Firestore Database → Rules).
                                                ========================================================================== */

                                                var firebaseConfig = {
                                                  apiKey: "AIzaSyAO3B3jf2ma81PhLZunnf-NMFXzkaI5N5c",
                                                    authDomain: "trimetrics-188e8.firebaseapp.com",
                                                      projectId: "trimetrics-188e8",
                                                        storageBucket: "trimetrics-188e8.firebasestorage.app",
                                                          messagingSenderId: "593943192399",
                                                            appId: "1:593943192399:web:2e45ff9d7f166309aedb3a"
                                                            };

                                                            firebase.initializeApp(firebaseConfig);
                                                            var db = firebase.firestore();
                                                            