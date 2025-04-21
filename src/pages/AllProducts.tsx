import React, {useEffect, useState} from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import {instance} from '../hook/Instance'
import {ProductsType} from '../components/NewProducts'
import {Pagination, Spin} from 'antd'
import noImage from "../assets/images/noImage.jpg"
import {ArrowDownOutlined, ArrowUpOutlined, LeftCircleOutlined, ShoppingOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom'
import {PATH} from '../hook/usePath'
import '../styles/CategoryButton.css'
import {useLanguage} from '../Context/LanguageContext'

// Category type definition
export interface CategoryType {
    id: number;
    name: string;
}

const AllProducts = () => {
    const navigate = useNavigate()
    const {translations} = useLanguage();
    const {language} = useLanguage();

    // Loading states for products and categories
    const [isloading, setIsLoading] = React.useState<boolean>(false);
    const [isCategoryLoading, setIsCategoryLoading] = React.useState<boolean>(false);
    const [showCategory, setShowCategory] = React.useState<boolean>(false);

    // State for gender filter and content visibility
    const [gender, setGender] = useState<string>("none")
    const [content, setContent] = useState<boolean>(false)

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Categories state and fetching logic
    const [categories, setCategories] = React.useState([]);
    useEffect(() => {
        if (gender != "none") {
            setContent(true)
            setIsCategoryLoading(true)
            // Fetch categories based on selected gender
            if (language === 'uz') {
                instance.get(`shop/categories/?gender=${gender}`,).then(res => {
                    setCategories(res.data.results);
                    setIsCategoryLoading(false);
                })
            } else if (language === 'ru') {
                instance.get(`shop/categories/?gender=${gender}&lang=ru`,).then(res => {
                    setCategories(res.data.results);
                    setIsCategoryLoading(false);
                })
            } else if (language === 'en') {
                instance.get(`shop/categories/?gender=${gender}&lang=en`,).then(res => {
                    setCategories(res.data.results);
                    setIsCategoryLoading(false);
                })
            }
        }
    }, [gender])

    // Product states and pagination
    const [allproducts, setAllProducts] = React.useState<ProductsType[]>([]);
    const [productCount, setProductCount] = React.useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectCategory, setSelectCategory] = useState<number>(0)
    const pageSize = 9;

    // Handle product click navigation
    const handleProductClick = (product: ProductsType) => {
        navigate(`${PATH.basket}/${product.id}`);
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Handle category selection
    function handleCategoryClick(id: number) {
        setSelectCategory(id)
    }

    // Fetch products when page or category changes
    useEffect(() => {
        setIsLoading(false);
        if (language === 'uz') {
            instance.get(`shop/products/${selectCategory}`, {
                params: {
                    page: currentPage,
                    page_size: pageSize,
                }
            }).then(res => {
                setProductCount(res.data.count);
                setAllProducts(res.data.results);
                setIsLoading(true);
                setShowCategory(false)
            })
        } else if (language === 'ru') {
            instance.get(`shop/products/${selectCategory}?lang=ru`, {
                params: {
                    page: currentPage,
                    page_size: pageSize,
                }
            }).then(res => {
                setProductCount(res.data.count);
                setAllProducts(res.data.results);
                setIsLoading(true);
                setShowCategory(false)
            });
        } else if (language === 'en') {
            instance.get(`shop/products/${selectCategory}?lang=en`, {
                params: {
                    page: currentPage,
                    page_size: pageSize,
                }
            }).then(res => {
                setProductCount(res.data.count);
                setAllProducts(res.data.results);
                setIsLoading(true);
                setShowCategory(false)
            })
        }
    }, [currentPage, selectCategory, language])

    return (
        <>
            <Header/>

            {/* desktop Responsive  */}
            <div className='w-[1476px] mx-auto hidden lg:flex items-start justify-between py-[100px]'>
                <div className={`w-[25%] caregoryList ${content ? "bg-white p-5" : ""}`}>
                    <h2 className='mb-[42px] font-medium text-[28px] text-[#3E3E3E]'>{translations.allProducts.title}</h2>
                    {!isCategoryLoading ?
                        <>
                            {content ?
                                // Category list view
                                <div
                                    className='w-full rounded-[20px] border-[2px] border-gray-500 h-[100vh] p-[20px] overflow-y-auto'>
                                    {/* Back button and title */}
                                    <div className='mb-[40px] flex items-center gap-5 ml-[10px]'>
                                        <button onClick={() => setContent(false)}><LeftCircleOutlined
                                            className='scale-[2] cursor-pointer inline-block'/></button>
                                        <p className='font-regular text-[22px]'>{gender == "all" ? translations.allProducts.all : gender == "male" ? translations.allProducts.men : gender == "female" ? translations.allProducts.girl : null}</p>
                                    </div>
                                    {/* Category list */}
                                    {Array.isArray(categories) && categories.length > 0 ? (
                                        <ul className='flex flex-col'>
                                            {categories.map((item: CategoryType, index: number) => (
                                                <li
                                                    key={`category-${item.id || index}`}
                                                    onClick={() => handleCategoryClick(item.id)}
                                                    className={`w-full px-[10px] py-[15px] rounded-[10px] flex items-center justify-between cursor-pointer toy-border mb-[20px] ${selectCategory === item.id ? "category-active" : ""}`}
                                                >
                                                    <p className='font-regular text-[22px] text-[#3E3E3E] line-clamp-2'>
                                                        {index + 1}. {item.name} {translations.allProducts.view}
                                                    </p>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <Spin className='w-full mt-[200px] scale-[3] block mx-auto relative z-30'
                                              size='large'/>
                                    )}
                                </div>
                                :
                                // Gender selection
                                <div className='w-full flex flex-col space-y-5'>
                                    <button onClick={() => setGender("all")}
                                            className={`w-full px-2 lg:px-[10px] py-3 lg:py-[15px] rounded-[10px] flex items-center justify-between cursor-pointer toy-border ${gender === "all" ? "category-active" : ""}`}>
                                        <p className="font-medium">{translations.allProducts.all}</p></button>
                                    <button onClick={() => setGender("male")}
                                            className={`w-full px-2 lg:px-[10px] py-3 lg:py-[15px] rounded-[10px] flex items-center justify-between cursor-pointer toy-border ${gender === "male" ? "category-active" : ""}`}>
                                        <p className="font-medium">{translations.allProducts.men}</p></button>
                                    <button onClick={() => setGender("female")}
                                            className={`w-full px-2 lg:x-[10px] py-3 lg:y-[15px] rounded-[10px] flex items-center justify-between cursor-pointer toy-border ${gender === "female" ? "category-active" : ""}`}>
                                        <p className="font-medium">{translations.allProducts.girl}</p></button>
                                </div>
                            }
                        </>
                        :
                        // Loading state for categories
                        <div className='flex flex-col mx-auto text-center gap-[20px]'>
                            <Spin className='scale-[2]' size='large'/>
                            <p>{translations.allProducts.loading}</p>
                        </div>
                    }</div>
                <div className='w-[70%] productList'>
                    <h2 className='inline-block mb-[42px] font-medium text-[28px] text-[#3E3E3E]'>{productCount} {translations.allProducts.productsFound}</h2>
                    {isloading ?
                        <>
                            <ul className='w-full flex items-center flex-wrap gap-[36px]'>
                                {Array.isArray(allproducts) && allproducts.length > 0 ? (
                                    allproducts.map((item: ProductsType) => (
                                        <li
                                            key={`product-${item.id}`}
                                            onClick={() => handleProductClick(item)}
                                            className='w-[320px] hover:shadow-xl hover:shadow-blue-300 overflow-hidden cursor-pointer duration-300 rounded-[20px] pb-[10px]'
                                        >
                                            <img className='w-full h-[231px] object-cover'
                                                 src={item.images?.[0] || noImage} alt={item.name || "Product Image"}
                                                 width={194} height={231}/>
                                            <div className='px-[30px] py-[20px]'>
                                                <h3 className='font-medium text-[24px] mb-0 line-clamp-2'>{item.name}</h3>

                                                {item.discount > 0 && (
                                                    <del className='font-regular text-[18px] text-[#73808E]'>
                                                        {new Intl.NumberFormat('uz-UZ').format(item.price)}
                                                    </del>
                                                )}

                                                <p className='font-medium text-[22px] text-[#3E3E3E]'>
                                                    {new Intl.NumberFormat('uz-UZ').format(item.discounted_price)}
                                                </p>
                                            </div>
                                            <button
                                                className='product-card-button cursor-pointer w-[200px] md-2 py-[15px] block mx-auto rounded-[12px] text-white font-medium text-[17px]'>{translations.allProducts.buyNow}
                                                <ShoppingOutlined/></button>
                                        </li>
                                    ))
                                ) : (
                                    <div className='w-full text-center'>
                                        <Spin size="large"/>
                                    </div>
                                )}
                            </ul>
                            {/* Pagination */}
                            <div className="flex justify-end mt-[100px]">
                                <Pagination total={productCount} pageSize={pageSize} current={currentPage}
                                            onChange={handlePageChange} showSizeChanger={false}
                                />
                            </div>
                        </>
                        :
                        // Loading state for products
                        <div className='w-full h-[40vh] relative'>
                            <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center'>
                                <Spin className='scale-[2]' size='large'/>
                                <p className='mt-4'>{translations.allProducts.loading}</p>
                            </div>
                        </div>
                    }
                </div>
            </div>
            {/* desktop Responsive  */}

            {/* Tablet Responsive  */}
            <div className='w-full mx-auto hidden md:flex lg:hidden items-start justify-between py-[60px] px-10'>
                <div className={`w-[30%] caregoryList ${content ? "bg-white p-5" : ""}`}>
                    <h2 className='mb-[61px] font-medium text-[18px] text-[#3E3E3E]'>{translations.allProducts.title}</h2>
                    {!isCategoryLoading ?
                        <>
                            {content ?
                                // Category list view
                                <div
                                    className='w-full rounded-[20px] border-[2px] border-gray-500 h-[100vh] py-[10px] px-3 overflow-y-auto'>
                                    {/* Back button and title */}
                                    <div className='w-full mb-[10px] flex items-center gap-[20px]'>
                                        <button onClick={() => setContent(false)}><LeftCircleOutlined
                                            className='scale-[1.5] cursor-pointer inline-block'/></button>
                                        <p className='font-regular text-[13px] text-left'>{gender == "all" ? translations.allProducts.all : gender == "male" ? translations.allProducts.men : gender == "female" ? translations.allProducts.girl : null}</p>
                                    </div>
                                    {/* Category list */}
                                    {Array.isArray(categories) && categories.length > 0 ? (
                                        <ul className='flex flex-col'>
                                            {categories.map((item: CategoryType, index: number) => (
                                                <li
                                                    key={`category-${item.id || index}`}
                                                    onClick={() => handleCategoryClick(item.id)}
                                                    className={`w-full px-[10px] py-[15px] rounded-[10px] flex items-center justify-between cursor-pointer toy-border mb-[20px] ${selectCategory === item.id ? "category-active" : ""}`}
                                                >
                                                    <p className='font-regular text-[15px] text-[#3E3E3E] line-clamp-2'>
                                                        {index + 1}. {item.name} {translations.allProducts.view}
                                                    </p>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <Spin className='w-full mt-[200px] scale-[3] block mx-auto relative z-30'
                                              size='large'/>
                                    )}
                                </div>
                                :
                                // Gender selection
                                <div className='w-full flex flex-col space-y-5'>
                                    <button onClick={() => setGender("all")}
                                            className={`w-full px-2 lg:px-[10px] py-3 lg:py-[15px] rounded-[10px] flex items-center justify-between cursor-pointer toy-border ${gender === "all" ? "category-active" : ""}`}>
                                        <p className="font-medium">{translations.allProducts.all}</p></button>
                                    <button onClick={() => setGender("male")}
                                            className={`w-full px-2 lg:px-[10px] py-3 lg:py-[15px] rounded-[10px] flex items-center justify-between cursor-pointer toy-border ${gender === "male" ? "category-active" : ""}`}>
                                        <p className="font-medium">{translations.allProducts.men}</p></button>
                                    <button onClick={() => setGender("female")}
                                            className={`w-full px-2 lg:x-[10px] py-3 lg:y-[15px] rounded-[10px] flex items-center justify-between cursor-pointer toy-border ${gender === "female" ? "category-active" : ""}`}>
                                        <p className="font-medium">{translations.allProducts.girl}</p></button>
                                </div>
                            }
                        </>
                        :
                        // Loading state for categories
                        <div className='flex flex-col mx-auto text-center gap-[20px]'>
                            <Spin className='scale-[2]' size='large'/>
                            <p>{translations.allProducts.loading}</p>
                        </div>
                    }</div>
                <div className='w-[67%] productList'>
                    <h2 className='inline-block mb-[42px] font-medium text-[28px] text-[#3E3E3E]'>{productCount} {translations.allProducts.productsFound}</h2>
                    {isloading ?
                        <>
                            <ul className='w-full flex items-center flex-wrap gap-[36px]'>
                                {Array.isArray(allproducts) && allproducts.length > 0 ? (
                                    allproducts.map((item: ProductsType) => (
                                        <li
                                            key={`product-${item.id}`}
                                            onClick={() => handleProductClick(item)}
                                            className='w-[250px] hover:shadow-xl hover:shadow-blue-300 overflow-hidden cursor-pointer duration-300 rounded-[20px] pb-[10px]'
                                        >
                                            <img className='w-full h-[231px] object-cover'
                                                 src={item.images?.[0] || noImage} alt={item.name || "Product Image"}
                                                 width={194} height={231}/>
                                            <div className='px-[30px] py-[20px]'>
                                                <h3 className='font-medium text-[24px] mb-0 line-clamp-2'>{item.name}</h3>

                                                {item.discount > 0 && (
                                                    <del className='font-regular text-[18px] text-[#73808E]'>
                                                        {new Intl.NumberFormat('uz-UZ').format(item.price)}
                                                    </del>
                                                )}

                                                <p className='font-medium text-[22px] text-[#3E3E3E]'>
                                                    {new Intl.NumberFormat('uz-UZ').format(item.discounted_price)}
                                                </p>
                                            </div>
                                            <button
                                                className='product-card-button cursor-pointer w-[200px] md-2 py-[15px] block mx-auto rounded-[12px] text-white font-medium text-[17px]'>{translations.allProducts.buyNow}
                                                <ShoppingOutlined/></button>
                                        </li>
                                    ))
                                ) : (
                                    <div className='w-full text-center'>
                                        <Spin size="large"/>
                                    </div>
                                )}
                            </ul>
                            {/* Pagination */}
                            <div className="flex justify-end mt-[100px]">
                                <Pagination total={productCount} pageSize={pageSize} current={currentPage}
                                            onChange={handlePageChange} showSizeChanger={false}
                                />
                            </div>
                        </>
                        :
                        // Loading state for products
                        <div className='w-full h-[40vh] relative'>
                            <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center'>
                                <Spin className='scale-[2]' size='large'/>
                                <p className='mt-4'>{translations.allProducts.loading}</p>
                            </div>
                        </div>
                    }
                </div>
            </div>
            {/* Tablet Responsive  */}

            {/* Mobile Responsive  */}
            <div className='w-full mx-auto flex items-start justify-between pt-[30px] px-4 relative md:hidden'>
                {showCategory ?
                    <div
                        className={`w-[60%] mt-[40px] bg-white caregoryList absolute z-40 py-[20px] border-[2px] border-black rounded-lg pr-[20px] pl-[10px]`}>
                        {!isCategoryLoading ?
                            <>
                                {content ?
                                    // Category list view
                                    <div className='w-full rounded-[20px] h-[60vh] py-[10px] px-3 overflow-y-auto'>
                                        {/* Back button and title */}
                                        <div className='w-full mb-[10px] flex items-center gap-[20px]'>
                                            <button onClick={() => setContent(false)}><LeftCircleOutlined
                                                className='scale-[1.5] cursor-pointer inline-block'/></button>
                                            <p className='font-regular text-[13px] text-left'>{gender == "all" ? translations.allProducts.all : gender == "male" ? translations.allProducts.men : gender == "female" ? translations.allProducts.girl : null}</p>
                                        </div>
                                        {/* Category list */}
                                        {Array.isArray(categories) && categories.length > 0 ? (
                                            <ul className='flex flex-col'>
                                                {categories.map((item: CategoryType, index: number) => (
                                                    <li
                                                        key={`category-${item.id || index}`}
                                                        onClick={() => handleCategoryClick(item.id)}
                                                        className={`w-full px-[10px] py-[15px] rounded-[10px] flex items-center justify-between cursor-pointer toy-border mb-[20px] ${selectCategory === item.id ? "category-active" : ""}`}
                                                    >
                                                        <p className='font-regular text-[15px] text-[#3E3E3E] line-clamp-2'>
                                                            {index + 1}. {item.name} {translations.allProducts.view}
                                                        </p>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <Spin className='w-full mt-[200px] scale-[3] block mx-auto relative z-30'
                                                  size='large'/>
                                        )}
                                    </div>
                                    :
                                    // Gender selection
                                    <div className='w-full flex flex-col space-y-5'>
                                        <button onClick={() => setGender("all")}
                                                className={`w-full px-[10px] py-[15px] rounded-[10px] flex items-center justify-between cursor-pointer toy-border ${gender === "all" ? "category-active" : ""}`}>
                                            <p className="font-medium">{translations.allProducts.all}</p></button>
                                        <button onClick={() => setGender("male")}
                                                className={`w-full px-[10px] py-[15px] rounded-[10px] flex items-center justify-between cursor-pointer toy-border ${gender === "male" ? "category-active" : ""}`}>
                                            <p className="font-medium">{translations.allProducts.men}</p></button>
                                        <button onClick={() => setGender("female")}
                                                className={`w-full px-[10px] py-[15px] rounded-[10px] flex items-center justify-between cursor-pointer toy-border ${gender === "female" ? "category-active" : ""}`}>
                                            <p className="font-medium">{translations.allProducts.girl}</p></button>
                                    </div>
                                }
                            </>
                            :
                            // Loading state for categories
                            <div className='flex flex-col mx-auto text-center gap-[20px]'>
                                <Spin className='scale-[2]' size='large'/>
                                <p>{translations.allProducts.loading}</p>
                            </div>
                        }</div> : null}
                <div className='w-[100%] productList relative'>
                    <div className='w-full flex items-center justify-between'>
                        <button onClick={() => setShowCategory(!showCategory)}
                                className='font-medium text-[13px] text-[#3E3E3E] mb-[42px] cursor-pointer w-[40%]'> {showCategory ? "Ortga qaytish" : "O'qinchoq Turlarini ko'rish"} {showCategory ?
                            <ArrowUpOutlined/> : <ArrowDownOutlined/>}</button>
                        <h2 className='mb-[42px] font-medium text-[13px] text-[#3E3E3E]'>{productCount} {translations.allProducts.productsFound}</h2>
                    </div>
                    {isloading ?
                        <>
                            <ul className='w-full flex items-center justify-between flex-wrap'>
                                {Array.isArray(allproducts) && allproducts.length > 0 ? (
                                    allproducts.map((item: ProductsType) => (
                                        <li
                                            key={`product-${item.id}`}
                                            onClick={() => handleProductClick(item)}
                                            className='w-[47%] hover:shadow-xl hover:shadow-blue-300 overflow-hidden cursor-pointer duration-300 rounded-[20px] pb-[10px] mb-[30px]'
                                        >
                                            <img className='w-full h-[130px] object-cover'
                                                 src={item.images?.[0] || noImage} alt={item.name || "Product Image"}
                                                 width={194} height={231}/>
                                         <div className='px-[30px] py-[20px]'>
                                                <h3 className='font-medium text-[24px] mb-0 line-clamp-2'>{item.name}</h3>

                                                {item.discount > 0 && (
                                                    <del className='font-regular text-[18px] text-[#73808E]'>
                                                        {new Intl.NumberFormat('uz-UZ').format(item.price)}
                                                    </del>
                                                )}

                                                <p className='font-medium text-[22px] text-[#3E3E3E]'>
                                                    {new Intl.NumberFormat('uz-UZ').format(item.discounted_price)}
                                                </p>
                                            </div>
                                            <button
                                                className='product-card-button cursor-pointer w-[130px] py-[10px] block mx-auto rounded-[12px] text-white font-medium text-[15px]'>{translations.allProducts.buyNow}
                                                <ShoppingOutlined/></button>
                                        </li>
                                    ))
                                ) : (
                                    <div className='w-full text-center'>
                                        <Spin size="large"/>
                                    </div>
                                )}
                            </ul>
                            {/* Pagination */}
                            <div className="flex justify-end">
                                <Pagination total={productCount} pageSize={pageSize} current={currentPage}
                                            onChange={handlePageChange} showSizeChanger={false}
                                />
                            </div>
                        </>
                        :
                        // Loading state for products
                        <div className='w-full h-[40vh] relative'>
                            <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center'>
                                <Spin className='scale-[2]' size='large'/>
                                <p className='mt-4'>{translations.allProducts.loading}</p>
                            </div>
                        </div>
                    }
                </div>
            </div>
            {/* Mobile Responsive  */}
            <Footer/>
        </>
    )
}

export default AllProducts
