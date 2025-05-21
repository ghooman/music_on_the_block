import blue from '../../assets/images/polygon-status/blue.svg';
import yellow from '../../assets/images/polygon-status/yellow.svg';
import red from '../../assets/images/polygon-status/red.svg';

import './PolygonStatus.scss';

import { checkPolygonStatus } from '../../api/checkPolygonStatus';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
export default function PolygonStatus() {
  const { t } = useTranslation('module');

  const [polygonStatus, setPolygonStatus] = useState({
    image: blue,
    text: 'The status of the Polygon network is smooth',
  });

  useEffect(() => {
    const fetchPolygonStatus = async () => {
      const status = await checkPolygonStatus();
      setPolygonStatus(status);
    };
    fetchPolygonStatus();
  }, []);
  // polygonStatus 따라 이미지 및 텍스트 변경 정상,혼잡,장애
  if (polygonStatus?.status?.includes('정상')) {
    setPolygonStatus({
      image: blue,
      text: 'The status of the Polygon network is smooth',
    });
  } else if (polygonStatus?.status?.includes('지연')) {
    setPolygonStatus({
      image: yellow,
      text: 'The Polygon network is experiencing some delays. Transactions may process slower than usual.',
    });
  } else if (polygonStatus?.status?.includes('장애')) {
    setPolygonStatus({
      image: red,
      text: 'The Polygon network is operating smoothly. You can proceed with your transaction.',
    });
  }
  return (
    <div className="polygon-status">
      <div className="polygon-status__img-box">
        <img src={polygonStatus.image} alt="polygon status" />
        <p>{t(polygonStatus.text)}</p>
      </div>
    </div>
  );
}
