import  { useState, useEffect, useRef } from 'react'
import { BasketIcon, CallIcon, ExitIcon, HeaderInstagramIcon, HeaderTelegramIcon, MailIcon, MenuIcon } from "../assets/Icon"
import { Link, NavLink } from 'react-router-dom'
import SiteLogo from "../assets/images/SiteLogo.svg"
import { PATH } from '../hook/usePath'
import { useLanguage } from '../Context/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'
import { useBasket } from '../Context/Context'
import { Badge } from 'antd'

const Header = () => {
    const [mobileMenu, setMobileMenu] = useState<boolean>(false)
    const { translations } = useLanguage();
    const { shopCount } = useBasket();
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMobileMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            {/* Desktop Header */}
            <header className='max-w-full hidden lg:block'>
                <div className='max-w-[1476px] mx-auto px-4 md:px-6 lg:px-8 mt-4 md:mt-6 lg:mt-[24px] mb-4 md:mb-6 lg:mb-[31px] flex items-center justify-between overflow-hidden'>
                    <div className='flex items-center gap-4 md:gap-6 lg:gap-[70px]'>
                        <Link className='flex items-center gap-2 md:gap-3 lg:gap-[12px]' to='mailto:Corleonevito6670@gmail.com'>
                            <MailIcon />
                            <p className='font-regular text-base md:text-lg lg:text-[20px] text-[#3E3E3E]'>Corleonevito6670@gmail.com</p>
                        </Link>
                        <Link className='flex items-center gap-2 md:gap-3 lg:gap-[12px]' to='tel:+998931374426'>
                            <CallIcon />
                            <p className='font-regular text-base md:text-lg lg:text-[20px] text-[#3E3E3E]'>+998931374426</p>
                        </Link>
                    </div>
                    <div className='flex items-center gap-4 md:gap-6 lg:gap-[30px]'>
                        <Link to={`https://www.instagram.com/marstoys_uz?igsh=MWF3YmhiaTQzcWV2Ng==`}>
                            <HeaderInstagramIcon />
                        </Link>
                        <Link to={`https://t.me/marstoysuz`}>
                            <HeaderTelegramIcon />
                        </Link>
                    </div>
                </div>
                <div className='max-w-full pt-[3px] pb-[7px] bg-[#EEEEEE]'>
                    <div className='max-w-[1476px] mx-auto px-4 md:px-6 lg:px-8'>
                        <div className='flex items-center justify-between'>
                            <Link to={'/'}><img className='w-16 md:w-20 lg:w-[80px] h-16 md:h-20 lg:h-[80px]' src={SiteLogo} alt="SiteLogo" /></Link>
                            <ul className='flex items-center gap-[50px] customWidth:gap-[100px]'>
                                <li><NavLink className='font-medium text-lg text-[18px] customWidth:text-[23px] customWidth:text-[28px] leading-[22px] text-[#3E3E3E]' to={PATH.home}>{translations.header.home}</NavLink></li>
                                <li><NavLink className='font-medium text-lg text-[18px] customWidth:text-[23px] customWidth:text-[28px] leading-[22px] text-[#3E3E3E]' to={PATH.allproducts}>{translations.header.allProducts}</NavLink></li>
                                <li><NavLink className='font-medium text-lg text-[18px] customWidth:text-[23px] customWidth:text-[28px] leading-[22px] text-[#3E3E3E]' to={PATH.basket}>{translations.header.basket}</NavLink></li>
                                <li><NavLink className='font-medium text-lg text-[18px] customWidth:text-[23px] customWidth:text-[28px] leading-[22px] text-[#3E3E3E]' to={PATH.orders}>{translations.header.orders}</NavLink></li>
                            </ul>
                            <div className='flex items-center gap-4 md:gap-6 lg:gap-[35px]'>
                                <div className='cursor-pointer relative'>
                                    <Link to={PATH.basket}>
                                        <Badge count={shopCount || 0} size="small" showZero={false}>
                                            <BasketIcon />
                                        </Badge>
                                    </Link>
                                </div>
                                <div className='cursor-pointer'><LanguageSwitcher /></div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Header */}
            <header className='block lg:hidden w-full bg-white shadow-sm'>
                <div className='px-4 py-3 flex items-center justify-between'>
                    <Link to={'/'}>
                        <img className='w-12 h-12' src={SiteLogo} alt="SiteLogo" />
                    </Link>
                    <div className='flex items-center gap-4'>
                        <Link to={PATH.basket} className='relative'>
                            <Badge count={shopCount || 0} size="small" showZero={false}>
                                <BasketIcon />
                            </Badge>
                        </Link>
                        <button onClick={() => setMobileMenu(!mobileMenu)}>
                            {mobileMenu ? <div className="scale-[2] mx-[5px]"><ExitIcon /></div> : <MenuIcon />}
                        </button>
                    </div>
                </div>

                {mobileMenu && (
                    <div ref={menuRef} className='fixed top-[13%] right-[1%] w-[250px] bg-white shadow-lg border-[1.5px] border-[#D9D9D9] z-40 rounded-lg'>
                        <div className='p-4'>
                            <nav className='mb-6'>
                                <ul className='space-y-4'>
                                    <li><NavLink className='text-[#333] text-lg font-medium block py-2' to={PATH.home} onClick={() => setMobileMenu(false)}>{translations.header.home}</NavLink></li>
                                    <li><NavLink className='text-[#333] text-lg font-medium block py-2' to={PATH.allproducts} onClick={() => setMobileMenu(false)}>{translations.header.catalog}</NavLink></li>
                                    <li><NavLink className='text-[#333] text-lg font-medium block py-2' to={PATH.basket} onClick={() => setMobileMenu(false)}>{translations.header.basket}</NavLink></li>
                                    <li><NavLink className='text-[#333] text-lg font-medium block py-2' to={PATH.orders} onClick={() => setMobileMenu(false)}>{translations.header.myOrders}</NavLink></li>
                                </ul>
                            </nav>

                            <div className='space-y-4 mb-6'>
                                <Link className='flex items-center gap-3 text-[#333] py-2' to='tel:+998939087085'>
                                    <CallIcon />
                                    <span>+998 (93) 908-70-85</span>
                                </Link>
                                <Link className='flex items-center gap-3 text-[#333] py-2' to='mailto:marstoys@gmail.com'>
                                    <MailIcon />
                                    <span>marstoys@gmail.com</span>
                                </Link>
                            </div>

                            <div className='border-t pt-4'>
                                <div className='flex flex-col gap-4'>
                                    <div className='relative z-[100]'>
                                        <LanguageSwitcher />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </header>
        </>
    )
}

export default Header
