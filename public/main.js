window.onload = () => {
    const myLiffId = '1657160448-1BWlzBQp';
    const divPage = document.getElementById('liff-page');

    //p要素の取得
    const pElement = document.getElementById('liff-message');

    //LIFFで立ち上げているかどうかの判定
    if (liff.isInClient()) {
        pElement.innerHTML = 'これはLIFF画面です'

        //LIFF初期化
        liff.init({
            liffId: myLiffId
        })
        .then(() => {

            //プロフィール情報の取得
            liff.getProfile()
                .then(profile => {
                    const name = profile.displayName;
                    const lineId = profile.userId;
                    const pElement2 = document.createElement('p');
                    pElement2.innerHTML = `あなたの名前は${name}です。LINE IDは${lineId}です。`;
                    divPage.appendChild(pElement2);
                })
        })
    } else {
        pElement.innerHTML = 'これはLIFF画面じゃありません'
    }

    divPage.appendChild(pElement);
}