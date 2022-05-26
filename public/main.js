
window.onload = () => {
    const myLiffId = '1657160448-1BWlzBQp';
    const divPage = document.getElementById('liff-page');

    //p要素の取得
    const pElement = document.getElementById('liff-message');
    divPage.appendChild(pElement);

    const pElementLog = document.getElementById('liff-log');
    divPage.appendChild(pElementLog);

    //LIFFで立ち上げているかどうかの判定
    if (liff.isInClient()) {
        pElement.innerHTML = 'これはLIFF画面です'

        //LIFF初期化
        liff.init({
            liffId: myLiffId
        })
        .then(() => {

            const idToken = liff.getIDToken();
            const jsonData = JSON.stringify({
                id_token: idToken
            });

            fetch('/api',{
                method: 'POST',
                headers: {
                  'Content-Type':'application/json'
                },
                body: jsonData,
                creadentials: 'same-origin'
              })
              .then(res=>{
                //ここにレスポンス返ってくる
                res.json()
                    .then(json=>{
                        //プロフィール情報の取得
                        liff.getProfile()
                            .then(profile => {
                                const name = profile.displayName;
                                const lineId = profile.userId;
                                const age = json.age;
                                const pElement2 = document.createElement('p');
                                pElement2.innerHTML = `あなたの名前は${name}です。<br>年齢は${age}歳です。<br>LINE IDは${lineId}です。`;
                                divPage.appendChild(pElement2);
                            });
                    })
              })
              .catch(e=>console.log(e));
        })
    } else {
        pElement.innerHTML = 'これはLIFF画面じゃありません'
    }

    divPage.appendChild(pElement);
}