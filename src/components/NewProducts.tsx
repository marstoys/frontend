import React, {useEffect} from 'react'
import {instance} from '../hook/Instance';
import {Button} from 'antd';
import {ArrowRightOutlined, ShoppingOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import {PATH} from '../hook/usePath';
import noImage from "../assets/images/noImage.jpg";
import {useLanguage} from '../Context/LanguageContext';

export interface ProductsType {
    id: number;
    name: string;
    price: string | number;
    discounted_price: string | number;
    quantity: number;
    discount: number;
    category: string | number;
    average_rating: number;
    images: string[];
    sold: number;
    description: string;
    comments?: CommentType[];
}

export interface CommentType {
    comment: string;
    created_at: string;
    first_name: string;
    product: number | string;
    rating: number;
}

const NewProducts = () => {
    const navigate = useNavigate()
    const {translations} = useLanguage();
    const {language} = useLanguage();
    const [products, setProducts] = React.useState<ProductsType[]>([]);
    useEffect(() => {
        if (language === 'uz') {
            instance.get<ProductsType[]>(`shop/new-products/`,).then(res => {
                setProducts(res.data);
            })
        } else if (language === 'ru') {
            instance.get<ProductsType[]>(`shop/new-products/?lang=ru`,).then(res => {
                setProducts(res.data);
            })
        } else if (language === 'en') {
            instance.get<ProductsType[]>(`shop/new-products/?lang=en`,).then(res => {
                setProducts(res.data);
            })
        }
    }, [language]);
    const handleProductClick = (item: ProductsType) => {
        navigate(`${PATH.basket}/${item.id}`);
    }
    return (
        <>
            {/* Desktop Products Responsive */}
            <div className="w-full max-w-[1474px] mx-auto px-4 overflow-hidden hidden lg:block">
                {/* Navbar */}
                <div className="mb-[20px]">
                    <h2 className="font-medium text-[40px] mb-[10px] text-center">{translations.newProducts.title}</h2>
                </div>

                {/* Products Section */}
                <div className="mb-[120px]">
                    <ul className="flex items-center flex-wrap justify-between gap-6">
                        {products?.map((item: ProductsType) => (
                            <li
                                key={item.id}
                                onClick={() => handleProductClick(item)}
                                className="w-[320px] shadow-xl hover:shadow-blue-300 overflow-hidden cursor-pointer duration-300 rounded-[20px] mb-[32px]"
                            >
                                <img
                                    className="w-full h-[231px] object-cover"
                                    src={item.images?.[0] || noImage}
                                    alt={item.name || "Product Image"}
                                    width={194}
                                    height={231}
                                />
                                <div className='px-[30px] py-[20px]'>
                                    <h3 className='font-medium text-[24px] mb-0 line-clamp-2'>{item.name}</h3>

                                    {item.discount > 0 && (
                                        <del className='font-regular text-[18px] text-[#73808E]'>
                                            {new Intl.NumberFormat('uz-UZ').format(Number(item.price))}
                                        </del>
                                    )}

                                    <p className='font-medium text-[22px] text-[#3E3E3E]'>
                                        {new Intl.NumberFormat('uz-UZ').format(Number(item.discounted_price))}
                                    </p>
                                </div>
                                <button
                                    className="product-card-button cursor-pointer w-[200px] py-[15px] block mx-auto mt-[18px] rounded-[12px] text-white font-medium text-[17px] bg-red-500 hover:bg-red-600 transition-colors">
                                    {translations.newProducts.buyText} <ShoppingOutlined/>
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div className="flex pb-[10px] justify-center">
                        <Button
                            onClick={() => navigate(PATH.allproducts)}
                            className="w-[200px] mt-[30px] rounded-[12px] !bg-red-500 hover:!bg-red-600"
                            size="large"
                            type="primary"
                        >
                            {translations.newProducts.allProductsButtonTxt} <ArrowRightOutlined/>
                        </Button>

                    </div>
                </div>
            </div>
            {/* Desktop Products Responsive */}


            {/* tablet Products Responsive */}
            <div className="max-w-full mx-5 px-2 overflow-hidden hidden md:block lg:hidden">
                <div className="w-full mb-[50px]">
                    <h2 className="font-medium text-[35px] mb-[70px] text-center">{translations.newProducts.title}</h2>
                    <ul className="w-full flex items-center flex-wrap gap-5 justify-between">
                        {products?.map((item: ProductsType) => (
                            <li onClick={() => handleProductClick(item)} key={item.id}
                                className="w-[250px] shadow-xl hover:shadow-blue-300 overflow-hidden cursor-pointer duration-300 rounded-[20px] pb-[10px] mb-[32px]">
                                <img className="w-full h-[200px] mb-0 object-cover" src={item.images?.[0] || noImage}
                                     alt={item.name || "Product Image"} width={194} height={231}/>
                                <div className='px-[30px] py-[20px]'>
                                    <h3 className='font-medium text-[24px] mb-0 line-clamp-2'>{item.name}</h3>

                                    {item.discount > 0 && (
                                        <del className='font-regular text-[18px] text-[#73808E]'>
                                            {new Intl.NumberFormat('uz-UZ').format(Number(item.price))}
                                        </del>
                                    )}

                                    <p className='font-medium text-[22px] text-[#3E3E3E]'>
                                        {new Intl.NumberFormat('uz-UZ').format(Number(item.discounted_price))}
                                    </p>
                                </div>
                                <button
                                    className="product-card-button cursor-pointer w-[200px] py-[15px] block mx-auto rounded-[12px] text-white font-medium text-[17px]">
                                    {translations.newProducts.buyText} <ShoppingOutlined/>
                                </button>
                            </li>
                        ))}
                    </ul>
                    <Button
                        onClick={() => navigate(PATH.allproducts)}
                        className="w-[200px] mt-[30px] rounded-[12px] !bg-red-500 hover:!bg-red-600"
                        size="large"
                        type="primary"
                    >
                        {translations.newProducts.allProductsButtonTxt} <ArrowRightOutlined/>
                    </Button>

                </div>
            </div>
            {/* tablet Products Responsive */}

            {/* Mobile Products Responsive */}
            <div className="max-w-full px-[10px] overflow-hidden md:hidden">
                <div className="w-full mb-[50px]">
                    <h2 className="font-medium text-[35px] mb-[70px] text-center">{translations.newProducts.title}</h2>
                    <ul className="w-full flex items-center flex-wrap justify-between">
                        {products?.map((item: ProductsType) => (
                            <li onClick={() => handleProductClick(item)} key={item.id}
                                className="w-[48%] shadow-xl hover:shadow-blue-300 overflow-hidden cursor-pointer duration-300 rounded-[20px] pb-[10px] mb-[32px]">
                                <img className="w-full h-[170px] mb-0 object-cover" src={item.images?.[0] || noImage}
                                     alt={item.name || "Product Image"} width={194} height={231}/>
                                <div className='px-[30px] py-[20px]'>
                                    <h3 className='font-medium text-[24px] mb-0 line-clamp-2'>{item.name}</h3>

                                    {item.discount > 0 && (
                                        <del className='font-regular text-[18px] text-[#73808E]'>
                                            {new Intl.NumberFormat('uz-UZ').format(Number(item.price))}
                                        </del>
                                    )}

                                    <p className='font-medium text-[22px] text-[#3E3E3E]'>
                                        {new Intl.NumberFormat('uz-UZ').format(Number(item.discounted_price))}
                                    </p>
                                </div>
                                <button
                                    className="product-card-button cursor-pointer w-[130px] py-[5px] block mx-auto rounded-[12px] text-white font-medium text-[15px]">
                                    {translations.newProducts.buyText} <ShoppingOutlined/>
                                </button>
                            </li>
                        ))}
                    </ul>
                    <Button
                        onClick={() => navigate(PATH.allproducts)}
                        className="w-[200px] mt-[30px] rounded-[12px] !bg-red-500 hover:!bg-red-600"
                        size="large"
                        type="primary"
                    >
                        {translations.newProducts.allProductsButtonTxt} <ArrowRightOutlined/>
                    </Button>

                </div>
            </div>
            {/* Mobile Products Responsive */}


        </>


    )
}

export default NewProducts
