document.addEventListener('DOMContentLoaded', () => {

  // -------------------------
  // SHARE FUNCTIONALITY
  // -------------------------
  const initShareButtons = () => {
    const shareUrl = window.location.href;
    const shareTitle = document.title;
    const shareBtnContainer = document.querySelector('.share-buttons-container');

    if (!shareBtnContainer) return;

    // Kakao SDK Init
    try {
      // 중요: 이 부분에 카카오 개발자 센터에서 발급받은 본인의 JavaScript 키를 입력해야 합니다.
      // https://developers.kakao.com/
      Kakao.init('YOUR_KAKAO_JAVASCRIPT_KEY');
    } catch(e) {
      console.error("Kakao SDK 초기화 실패. API 키를 확인해주세요.", e);
      const kakaoBtn = document.getElementById('share-kakao');
      if(kakaoBtn) kakaoBtn.style.display = 'none'; // 키가 없으면 버튼 숨김
    }


    shareBtnContainer.addEventListener('click', (e) => {
      const target = e.target.closest('.share-btn');
      if (!target) return;

      e.preventDefault();

      const id = target.id;

      switch (id) {
        case 'share-twitter':
          window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`, '_blank');
          break;

        case 'share-facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
          break;

        case 'share-kakao':
          if (!Kakao.isInitialized()) {
            alert("Kakao SDK가 초기화되지 않았습니다. API 키를 확인해주세요.");
            return;
          }
          Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
              title: shareTitle,
              description: document.querySelector('meta[name="description"]').getAttribute('content'),
              imageUrl: document.querySelector('meta[property="og:image"]').getAttribute('content'),
              link: {
                mobileWebUrl: shareUrl,
                webUrl: shareUrl,
              },
            },
            buttons: [
              {
                title: '게임하러 가기',
                link: {
                  mobileWebUrl: shareUrl,
                  webUrl: shareUrl,
                },
              },
            ],
          });
          break;

        case 'copy-link':
          navigator.clipboard.writeText(shareUrl).then(() => {
            const originalText = target.querySelector('span').textContent;
            target.querySelector('span').textContent = '복사 완료!';
            setTimeout(() => {
              target.querySelector('span').textContent = originalText;
            }, 2000);
          }).catch(err => {
            console.error('링크 복사 실패:', err);
            alert('링크 복사에 실패했습니다.');
          });
          break;
      }
    });
  };

  initShareButtons();

});
