import React from 'react'
import HeroTitle from "../assets/images/heroTitle.png"
import { useNavigate } from 'react-router-dom'
import { PATH } from '../hook/usePath'
import { useLanguage } from '../Context/LanguageContext'

const Hero = () => {
    const navigate = useNavigate()
    const { translations } = useLanguage();
    return (
        <>
            {/* Desktop hero */}
            <div className='hidden lg:block HeroBg relative overflow-hidden px-8 py-[300px]'>
                <div className='w-[1476px] h-[51vh] overflow-y-hidden mx-auto'>
                    <img className='w-[556px] h-auto mb-[55px]' src={HeroTitle} alt="HeroTitle" width={556} height={137} />
                    <p className='font-regular text-[24px] text-white mb-[51px]'>
                        {translations.Hero.subtitle}
                    </p>
                    <button onClick={() => navigate(PATH.allproducts)} className='w-[276px] py-[12px] px-8 rounded-lg bg-white cursor-pointer font-medium text-[30px] text-[#3E3E3E] hover:bg-gray-100 transition-colors'>
                        {translations.Hero.buttonText}
                    </button>
                </div>
            </div>
            {/* Desktop hero */}

            {/* Tablet hero */}
            <div className='HeroBg mb-[100px] relative overflow-hidden py-[100px] hidden md:block lg:hidden'>
                <div className='ml-[100px]'>
                    <img className='w-[256px] h-auto mb-[25px]' src={HeroTitle} alt="HeroTitle" width={556} height={137} />
                    <p className='font-regular text-[24px] text-white mb-[31px]'>
                        {translations.Hero.subtitle}
                    </p>
                    <button onClick={() => navigate(PATH.allproducts)} className='w-[200px] py-[5px] px-4 rounded-lg bg-white cursor-pointer font-medium text-[25px] text-[#3E3E3E] hover:bg-gray-100 transition-colors'>
                        {translations.Hero.buttonText}
                    </button>
                </div>
            </div>
            {/* Tablet hero */}

            {/* Mobile hero */}
            <div className='HeroBg mb-[50px] relative overflow-hidden py-10 block md:hidden'>
                <div className='max-w-[230px] ml-[30px]'>
                    <img className='w-[170px] h-auto mb-4' src={HeroTitle} alt="HeroTitle" width={556} height={137} />
                    <p className='font-regular text-[17px] text-white mb-[11px]'>
                        {translations.Hero.subtitle}
                    </p>
                    <button onClick={() => navigate(PATH.allproducts)} className='w-[150px] py-[5px] px-4 rounded-lg bg-white cursor-pointer font-medium text-[15px] text-[#3E3E3E] hover:bg-gray-100 transition-colors'>
                        {translations.Hero.buttonText}
                    </button>
                </div>
            </div>
            {/* Mobile hero */}
        </>
    )
}

export default Hero
