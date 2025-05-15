import { useRef, useState, useEffect } from 'react';
import {
  SongPlayEditTableWrapper,
  SongPlayEditButtons,
  SongPlayEditTable,
} from '../../unit/SongPlayEditTable';

import './AlbumCollectionEditList.scss';
import ErrorModal from '../../modal/ErrorModal';
import AlbumCollectionNoticeModal from './modals/AlbumCollectionNoticeModal';

const AlbumCollectionEditList = ({
  availableList,
  setAvailableList,
  selectedList,
  setSelectedList,
  target,
  infiniteScorollEvent,
}) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [duplicateCount, setDuplicateCount] = useState(0);
  const [activeSong, setActiveSong] = useState(null);

  const audioRef = useRef(null);

  //=================
  // 추가
  //=================
  const handleAdd = () => {
    let duplicateCount = 0;
    const copy = [...availableList];
    const newCopy = copy.filter(item => item.check === true);
    const addBundleMaps = Array.from(new Map(newCopy.map(item => [item.id, item])).values());
    const albumBundleMaps = new Map(selectedList.map(item => [item.id, item]));

    addBundleMaps.forEach(item => {
      const result = albumBundleMaps.get(item.id);
      if (result) {
        duplicateCount++;
      }
    });

    if (albumBundleMaps.size + addBundleMaps.length > 500) {
      setErrorMessage('No more songs can be added.');
      return;
    }

    setAvailableList(prev => prev.map(item => ({ ...item, check: false }))); // 모든 데이터 체크 비활성화
    setDuplicateCount(duplicateCount);
    setSelectedList(prev => {
      let copy = [...prev];
      let checkReset = addBundleMaps.map(item => ({ ...item, check: false }));
      let maps = new Map([...copy, ...checkReset].map(item => [item.id, item]));
      return Array.from(maps.values());
    });
  };

  //=================
  // 삭제
  //=================
  const handleDelete = () => {
    const copy = [...selectedList];
    const newCopy = copy.filter(item => !item.check);
    setSelectedList(newCopy);
    setActiveSong(null);
  };

  //=================
  // 음악 재생
  //=================
  useEffect(
    function playMusic() {
      if (!activeSong) {
        audioRef.current.pause();
      } else {
        audioRef.current.currentTime = 0;
        audioRef.current.src = activeSong?.music_url;
        audioRef.current.play();
      }
    },
    [activeSong]
  );

  // 공용 프롭스
  const props = {
    activeSong: activeSong,
    setActiveSong: setActiveSong,
    songOption: target === 'Album',
    titleOption: target === 'Album',
    itemOption: target === 'Collection',
    typeOption: target === 'Collection',
    gradeOption: target === 'Collection',
    target: target,
  };

  console.log(availableList, '어베일러블');

  return (
    <>
      <div className="audio-container" style={{ display: 'none' }}>
        <audio controls ref={audioRef} />
      </div>
      {errorMessage && (
        <ErrorModal setShowErrorModal={setErrorMessage} message={errorMessage} button />
      )}
      {duplicateCount > 0 && (
        <AlbumCollectionNoticeModal setAlbumsNoticeModal={setDuplicateCount} />
      )}
      <SongPlayEditTableWrapper>
        <SongPlayEditTable
          title={target === 'Collection' ? 'Selected NFTs' : 'Selected Songs'}
          songList={availableList}
          setSongList={setAvailableList}
          infiniteScorollEvent={infiniteScorollEvent}
          {...props}
        />
        <SongPlayEditButtons handleAdd={() => handleAdd()} handleDelete={() => handleDelete()} />
        <SongPlayEditTable
          title={target === 'Collection' ? 'Collection NFTs' : 'Album Songs'}
          songList={selectedList}
          setSongList={setSelectedList}
          {...props}
          limit={500}
        />
      </SongPlayEditTableWrapper>
    </>
  );
};

export default AlbumCollectionEditList;
