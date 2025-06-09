import '../styles/Get.scss';
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Timer from '../components/get/Timer';

function Get() {
  const { t } = useTranslation('get');

  return (
    <>
      <div className="get">
        <section className="get__header">
          <dl className="get__header__title">
            <dt>{t('Get Race')}</dt>
            <dd>
              {t(
                'Join the competition by burning your reward tokens – and discover new value in the process.'
              )}
            </dd>
          </dl>
        </section>
        <section className="get__content">
          <Link to="/get/detail" className="get__content__item">
            <div className="get__content__item__day-mob">
              <p>Day 1</p>
              <p>MOB</p>
            </div>
            <dl className="get__content__item__mob">
              <dt>{t('Total Reward')}(MOB)</dt>
              <dd>
                <p>100,000</p>
              </dd>
            </dl>
            <dl className="get__content__item__minutes">
              <dt>
                {t('Updated Every')} 30 {t('Minutes')}
                <span>{t('Total Geted')}MIC</span>
              </dt>
              <dd>100,000</dd>
            </dl>
            <dl className="get__content__item__start-time">
              <dt>{t('Start Time')}</dt>
              <dd>Sat, 04 Nov 2023 14:40:00 UTC+9</dd>
            </dl>
            <dl className="get__content__item__remaining-time">
              <dt>{t('Remaining Time')}</dt>
              <dd>
                <Timer fontSize={18} color={'#00FFB3'} fontFamily={'Inter700'} textWidth={10} />
              </dd>
            </dl>
          </Link>
          <Link to="/get/detail" className="get__content__item">
            <div className="get__content__item__day-mob">
              <p>Day 1</p>
              <p>MOB</p>
            </div>
            <dl className="get__content__item__mob">
              <dt>{t('Total Reward')}(MOB)</dt>
              <dd>
                <p>{t('Basic Reward')} 30,000</p> + <span>{t('Revenue Share')} 20,000</span>
              </dd>
            </dl>
            <dl className="get__content__item__minutes">
              <dt>
                {t('Updated Every')} 30 {t('Minutes')}
                <span>{t('Total Geted')} MIC</span>
              </dt>
              <dd>100,000</dd>
            </dl>
            <dl className="get__content__item__start-time">
              <dt>{t('Start Time')}</dt>
              <dd>Sat, 04 Nov 2023 14:40:00 UTC+9</dd>
            </dl>
            <dl className="get__content__item__remaining-time">
              <dt>{t('Remaining Time')}</dt>
              <dd>
                <Timer fontSize={18} color={'#00FFB3'} fontFamily={'Inter700'} textWidth={10} />
              </dd>
            </dl>
          </Link>
          <Link to="/get/detail" className="get__content__item">
            <div className="get__content__item__day-mob">
              <p>Day 1</p>
              <p>MOB</p>
            </div>
            <dl className="get__content__item__mob">
              <dt>{t('Total Reward')}(MOB)</dt>
              <dd>
                <p>{t('Basic Reward')} 30,000</p> + <span>{t('Revenue Share')} 20,000</span>
              </dd>
            </dl>
            <dl className="get__content__item__minutes">
              <dt>
                {t('Updated Every')} 30 {t('Minutes')}
                <span>{t('Total Geted')} MIC</span>
              </dt>
              <dd>100,000</dd>
            </dl>
            <dl className="get__content__item__start-time">
              <dt>{t('Start Time')}</dt>
              <dd>Sat, 04 Nov 2023 14:40:00 UTC+9</dd>
            </dl>
            <dl className="get__content__item__remaining-time">
              <dt>{t('Remaining Time')}</dt>
              <dd>
                <Timer fontSize={18} color={'#00FFB3'} fontFamily={'Inter700'} textWidth={10} />
              </dd>
            </dl>
          </Link>
          <Link to="/get/detail" className="get__content__item none-item">
            <p className="get__content__item__none-title">{t('Get the Pool in Preparation')}</p>
          </Link>
        </section>
      </div>
    </>
  );
}

export default Get;
