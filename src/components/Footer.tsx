import { InstagramIcon, TelegramIcon } from '../assets/Icon'
import { Link } from 'react-router-dom'
import { useLanguage } from '../Context/LanguageContext';

const Footer = () => {
  const { translations } = useLanguage();
  return (
   <footer className="w-full lg:max-w-[1000px] mx-auto bg-white">
  <div className='max-w-full mx-auto px-3 lg:px-5'>
    <div className='py-6 lg:py-[60px]'>
      <div className='w-full flex items-center justify-between'>
        <ul className='w-[60%] flex flex-col gap-1 md:gap-[5px] lg:w-auto'>
          <li>
            <strong className='font-medium text-[12px] md:text-[16px] lg:text-[20px] text-[#3E3E3E] mb-[2px]'>{translations.footer.aboutUs}</strong>
          </li>
          <li className='font-medium text-[10px] md:text-[16px] lg:text-[20px] text-[#AAA3A3]'>{translations.footer.address}</li>
          <li className='font-medium text-[10px] md:text-[16px] lg:text-[20px] text-[#AAA3A3]'>
            <Link className='cursor-pointer' to={`tel:+998931374426`}>
              {translations.footer.phoneNumber} +998931374426
            </Link>
          </li>
        </ul>
        <ul className='w-[35%] flex flex-col gap-1 md:gap-2 lg:w-auto'>
          <li>
            <strong className='font-medium text-[12px] md:text-[18px] lg:text-[24px] text-[#3E3E3E]'>{translations.footer.socialMedia}</strong>
          </li>
          <li className='flex items-center gap-2 md:gap-3 mt-2'>
            <Link to={`https://www.instagram.com/marstoys_uz?igsh=MWF3YmhiaTQzcWV2Ng==`}>
              <InstagramIcon />
            </Link>
            <Link to={`https://t.me/marstoysuz`}>
              <TelegramIcon />
            </Link>
          </li>
        </ul>
      </div>
    </div>
    <div className='w-full border-t border-[#D9D9D9]'>
      <p className='text-center text-[10px] lg:text-[16px] text-[#D1D1D1] py-1 lg:py-3'>
        {translations.footer.copyright}
      </p>
    </div>
  </div>
</footer>

  )
}

export default Footer
