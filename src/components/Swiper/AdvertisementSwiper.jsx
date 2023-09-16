import axios from 'axios';
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import './AdvertisementSwiper.css';

const AdvertisementSwiper = ({ isShop }) => {
  const [AD, setAD] = useState();

  const getAD = async () => {
    await axios.get('/data/ad.json').then((res) => setAD(res.data));
  };

  useEffect(() => {
    getAD();
  }, []);

  return (
    <Swiper
      slidesPerView={1}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      modules={[Autoplay]}
      loop={true}
    >
      {Array.isArray(AD) &&
        AD.map((item, index) => {
          return (
            <SwiperSlide key={index}>
              <div className={'ad'}>
                <img src={item.ad_src} className={'ad_img'} />
                <div className={'ad_button'}>
                  <div>
                    <span className="ad_current">{item.ad_id}</span>
                    <span className="ad_total">{`/${AD.length}`}</span>
                  </div>
                  <div className="ad_plus">+</div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
    </Swiper>
  );
};

export default AdvertisementSwiper;
