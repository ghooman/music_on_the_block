import dummy_image1 from '../../assets/images/demo/album01.svg';
import dummy_image2 from '../../assets/images/demo/album02.svg';
import dummy_image3 from '../../assets/images/demo/album03.svg';
import dummy_image4 from '../../assets/images/demo/album04.svg';
import dummy_image5 from '../../assets/images/demo/album05.svg';
import dummy_image6 from '../../assets/images/demo/album06.svg';

class NFT {
    name;
    collection_name;
    image;
    price;
    quantity;
    genre;
    type = 'music';
    music_url;
    constructor(이름, 콜렉션, 이미지, 가격, 수량, 장르, url) {
        this.name = 이름;
        this.collection_name = 콜렉션;
        this.image = 이미지;
        this.price = 가격;
        this.quantity = 수량;
        this.genre = 장르;
        this.music_url = url;
    }
}

export const dummy_NFT = [
    new NFT('제목', '콜렉션', '가격', dummy_image1, '수량', 'POP', 'https://naver.com'),
    new NFT('제목', '콜렉션', '가격', dummy_image2, '수량', 'POP', 'https://naver.com'),
    new NFT('제목', '콜렉션', '가격', dummy_image3, '수량', 'POP', 'https://naver.com'),
    new NFT('제목', '콜렉션', '가격', dummy_image4, '수량', 'POP', 'https://naver.com'),
    new NFT('제목', '콜렉션', '가격', dummy_image5, '수량', 'POP', 'https://naver.com'),
    new NFT('제목', '콜렉션', '가격', dummy_image6, '수량', 'POP', 'https://naver.com'),
];
export const dummy_Collection = [{}];
