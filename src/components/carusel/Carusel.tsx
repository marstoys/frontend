import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectCoverflow } from "swiper/modules";
import ToysImg from "../../assets/images/toysImg.png"
import Toys2Img from "../../assets/images/legoToysImg.png"
import Toys3Img from "../../assets/images/toys3img.png"
import Toys4Img from "../../assets/images/toys4Img.png"
import Toys5Img from "../../assets/images/toys5Img.png"
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "./Carusel.css";
import { useLanguage } from "../../Context/LanguageContext";



const Carusel: React.FC = () => {
    const { translations } = useLanguage();
    return (
        <div className="w-full h-auto lg:h-[100vh] mx-auto carousel-container px-4">
            <h2 className="font-medium text-[24px] lg:text-[48px] text-center mb-[32px] lg:mb-[200px] carousel-title">
                {translations.catalog.title}
            </h2>
            <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
                spaceBetween={30}
                slidesPerView={1}
                navigation={true}
                pagination={{ clickable: true }}
                autoplay={{
                    delay: 2000,
                    disableOnInteraction: false,
                }}
                effect="coverflow"
                coverflowEffect={{
                    rotate: 0,
                    stretch: 0,
                    depth: 100,
                    modifier: 2.5,
                    slideShadows: true,
                }}
                loop={true}
                className="mySwiper"
                breakpoints={{
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 20
                    },
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 30
                    }
                }}
            >
                <SwiperSlide>
                    <div className="carousel-item cursor-pointer w-full lg:w-[448px] rounded-[8px] lg:rounded-[16px] overflow-hidden duration-300 mx-auto">
                        <img className="object-cover w-full h-[60vh] md:h-[644px] carousel-image" src={ToysImg} alt="ToysImg" />
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="carousel-item cursor-pointer w-full lg:w-[448px] rounded-[8px] lg:rounded-[16px] overflow-hidden duration-300 mx-auto">
                        <img className="object-cover w-full h-[60vh] md:h-[644px] carousel-image" src={Toys2Img} alt="Toys2Img" />
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="carousel-item cursor-pointer w-full lg:w-[448px] rounded-[8px] lg:rounded-[16px] overflow-hidden duration-300 mx-auto">
                        <img className="object-cover w-full h-[60vh] md:h-[644px] carousel-image" src={Toys3Img} alt="Toys3Img" />
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="carousel-item cursor-pointer w-full lg:w-[448px] rounded-[8px] lg:rounded-[16px] overflow-hidden duration-300 mx-auto">
                        <img className="object-cover w-full h-[60vh] md:h-[644px] carousel-image" src={Toys4Img} alt="Toys4Img" />
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="carousel-item cursor-pointer w-full lg:w-[448px] rounded-[8px] lg:rounded-[16px] overflow-hidden duration-300 mx-auto">
                        <img className="object-cover w-full h-[60vh] md:h-[644px] carousel-image" src={Toys5Img} alt="Toys5Img" />
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    );
};

export default Carusel;