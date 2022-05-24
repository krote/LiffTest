window.onload = () => {
    const myLiffId = '165xxxxx13-Xexxxxxn';
    const divPage = document.getElementById('liff-page');
    
    //p要素の取得
    const pElement = document.getElementById('liff-message');
    
    //LIFFで立ち上げているかどうかの判定
    if(liff.isInClient()){
      pElement.innerHTML='これはLIFF画面です'
    }else{
      pElement.innerHTML='これはLIFF画面じゃありません'
    }
    
    divPage.appendChild(pElement);
   }