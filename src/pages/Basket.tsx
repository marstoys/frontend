import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { useNavigate, useParams } from 'react-router-dom'
import { instance } from '../hook/Instance'
import { CommentType, ProductsType } from '../components/NewProducts'
import { Button, Empty, InputNumber } from 'antd'
import { StarFilled, ShoppingOutlined, LeftOutlined, RightOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { PATH } from '../hook/usePath'
import { useBasket } from '../Context/Context'
import noImage from "../assets/images/noImage.jpg"
import toast, { Toaster } from 'react-hot-toast'
import { useLanguage } from '../Context/LanguageContext'

interface Order {
  id: number;
  items: ProductsType[];
  totalPrice: number;
  date: string;
}

interface BasketItem extends ProductsType {
  quantity: number;
}

const Basket = () => {
  const { id } = useParams()
  const { translations } = useLanguage();
  const { language } = useLanguage();
  const [product, setProduct] = useState<ProductsType>()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState<number>(1)
  const navigate = useNavigate()
  const { addToBasket, basketItems, removeFromBasket, updateQuantity, basketCount } = useBasket()
  const [commentList, setCommentList] = useState<CommentType[] | undefined>(undefined);

  useEffect(() => {
    if (id) {
      if (language === 'uz') {  
        instance.get<ProductsType>(`shop/product-details/${id}/`).then(res => {
          setProduct(res.data);
          setCommentList(res.data.comments);
        })
      } else if (language === 'ru') {
        instance.get<ProductsType>(`shop/product-details/${id}/?lang=ru`).then(res => {
          setProduct(res.data);
          setCommentList(res.data.comments);
        })
      } else if (language === 'en') {
        instance.get<ProductsType>(`shop/product-details/${id}/?lang=en`).then(res => {
          setProduct(res.data);
          setCommentList(res.data.comments);
        })
      }
    }
  }, [id])

  function nextImage() {
    if (product?.images) {
      setSelectedImageIndex(function (prev) {
        return (prev + 1) % product.images.length;
      });
    }
  }

  function prevImage() {
    if (product?.images) {
      setSelectedImageIndex(function (prev) {
        return (prev - 1 + product.images.length) % product.images.length;
      });
    }
  }

  function handleThumbnailClick(index: number) {
    setSelectedImageIndex(index);
  }

  function handleAddToBasket() {
    if (product) {
      addToBasket(product, quantity);
      toast.success(translations.basket.addToCart);
      navigate(PATH.basket);
    }
  }

  function handleRemoveFromBasket(productId: number) {
    removeFromBasket(productId);
    toast.success(translations.basket.deleteButton);
  }

  function handleUpdateQuantity(productId: number, newQuantity: number) {
    updateQuantity(productId, newQuantity);
    toast.success(translations.basket.count);
  }

  function calculateTotal() {
    return basketItems.reduce((total, item) => {
      const price = typeof item.price === 'string' ? parseInt(item.price) : item.price;
      return total + (price * item.quantity);
    }, 0);
  }

  function handlePlaceOrder() {
    if (basketItems.length === 0) {
      toast.error(translations.basket.noProductSelected);
      return;
    }

    const order: Order = {
      id: Date.now(),
      items: basketItems,
      totalPrice: calculateTotal(),
      date: new Date().toISOString()
    };

    // Get existing orders from localStorage
    const existingOrders = localStorage.getItem('orders');
    const orders = existingOrders ? JSON.parse(existingOrders) : [];

    // Add new order
    orders.push(order);

    // Save updated orders to localStorage
    localStorage.setItem('orders', JSON.stringify(orders));
    // Clear basket
    basketItems.forEach(item => removeFromBasket(item.id));
    toast.success("Buyurtma muvaffaqiyatli qabul qilindi");
    navigate(PATH.saleInfo);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-blue-50">
      <Header />
      <Toaster position="top-center" reverseOrder={false} />
      {/* Desktop Basket  */}
      {id ? (
        <div className='w-[1476px] mx-auto py-[50px] hidden lg:block'>
          {product && (
            <div className='flex items-center justify-between'>
              <div className='w-[900px] flex items-center gap-[24px]'>
                <ul className='w-[126px] flex flex-col gap-[20px]'>
                  {Array.isArray(product.images) && product.images.length > 0 ? (
                    product.images.map((image, index) => (
                      <li 
                        key={`image-${index}`} 
                        onClick={() => handleThumbnailClick(index)} 
                        className={`w-[80px] h-[80px] rounded-[12px] overflow-hidden cursor-pointer border-2 transition-all ${selectedImageIndex === index ? 'border-blue-500 scale-110' : 'border-gray-200'}`}
                      >
                        <img src={image} alt={`${product.name}-${index}`} className='w-full h-full object-cover' />
                      </li>
                    ))
                  ) : null}
                </ul>
                <div className='w-[750px] h-[500px] relative mb-5 rounded-2xl overflow-hidden border-2 border-black bg-white shadow-lg flex-row'>
                  <img src={product.images[selectedImageIndex]} alt={product.name} className='w-full h-full object-cover' />
                  <button
                    onClick={prevImage}
                    className='absolute cursor-pointer left-4 top-1/2 transform -translate-y-1/2 w-[40px] h-[40px] bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-all'
                  >
                    <LeftOutlined className='text-[20px]' />
                  </button>
                  <button
                    onClick={nextImage}
                    className='absolute cursor-pointer right-4 top-1/2 transform -translate-y-1/2 w-[40px] h-[40px] bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-all'
                  >
                    <RightOutlined className='text-[20px]' />
                  </button>
                </div>
              </div>
              <div className='w-[450px] borde-[2px] border-black rounded-[16px] bg-white shadow-lg shadow-black px-[40px] py-[50px]'>
                <h1 className='text-[32px] font-semibold mb-[39px] text-[#3E3E3E]'>{product.name}</h1>
                <div className='mb-[60px]'>
                  <p className='text-gray-600'>{translations.basket.company}</p>
                  <div className='gap-1 flex flex-col'>
                    <div className='flex items-center gap-[10px]'>
                      <StarFilled className='!text-yellow-400' />
                      <span>{product.average_rating} {translations.basket.rating}</span>
                    </div>
                    <div className='flex items-center gap-[10px]'>
                      <ShoppingOutlined className='!text-yellow-400' />
                      <p className='text-gray-600'>{product.sold} {translations.basket.timesSold}</p>
                    </div>
                  </div>
                </div>
                <div className='mb-6'>
                  {product.discounted_price ? (
                    <del className='text-[#D9D9D9] font-medium text-[22px] mb-[4px]'>
                      {product.discounted_price} {translations.basket.sum}
                    </del>
                  ) : null}
                  <p className='font-medium text-[32px] text-[#3E3E3E]'>
                    {product.price} {translations.basket.sum}
                  </p>
                </div>
                <div className='flex items-center gap-4 mb-6'>
                  <div className='w-full flex items-center border rounded-lg overflow-hidden'>
                    <button
                      onClick={() => setQuantity(prev => Math.max(0, prev - 1))}
                      className='w-[40%] cursor-pointer px-4 py-2 text-[20px] bg-pink-100 hover:bg-pink-200 transition-colors'
                    >
                      -
                    </button>
                    <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 1))} className='w-[20%] text-center border-x py-2' />
                    <button
                      onClick={() => setQuantity(prev => prev + 1)}
                      className='w-[40%] cursor-pointer px-4 py-2 text-[20px] bg-pink-100 hover:bg-pink-200 transition-colors'
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="w-full border-black hover:scale">
                  <Button type="primary" size="large" icon={<ShoppingOutlined />} className='w-full py-[10px] text-[18px] !bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 border-none' onClick={handleAddToBasket}> {translations.basket.addToCart} </Button>
                </div>
              </div>
            </div>
          )}
          <div className='comment w-full flex gap-[24px] mt-[50px] p-0'>
            <div className='w-[1026px] border-[1px] rounded-[16px] border-[#DEDFE7] px-[53px] py-[51px] bg-white shadow-lg'>
              <h2 className='text-[24px] font-bold mb-4'>{translations.basket.commentTitle}</h2>
              <p className='text-gray-600'>{product?.description}</p>
            </div>
            <div className='w-[426px] px-[30px] pt-[51px] pb-[30px] rounded-[10px] border-[1px] border-[#DEDFE7] bg-white shadow-lg'>
              <h2 className='font-medium text-[32px] text-[#3E3E3E] mb-[43px]'>{translations.basket.comment}</h2>
              <ul className='flex flex-col gap-[44px]'>
                {Array.isArray(commentList) && commentList.length > 0 ? (
                  commentList.map((item: CommentType, index: number) => (
                    <li key={`comment-${index}`} className='w-full'>
                      <div className='flex justify-between mb-[14px]'>
                        <div className='flex flex-col'>
                          <h3 className='font-medium text-[18px] text-[#3E3E3E]'>{item.first_name}</h3>
                          <p className='font-light text-[14px] text-[#3E3E3E]'>{item.created_at}</p>
                        </div>
                        <ul className='flex items-center gap-[3px]'>
                          {[...Array(5)].map((_, i) => (
                            <li key={`star-${i}`} className="hover-rotate">
                              <StarFilled className={i < (item.rating || 0) ? '!text-[#FFC117]' : '!text-[#E0E0E0]'} />
                            </li>
                          ))}
                        </ul>
                      </div>
                      <p className='font-regular text-[16px] text-[#3E3E3E]'>{item.comment}</p>
                    </li>
                  ))
                ) : null}
              </ul>

            </div>
          </div>
        </div>
      ) : (
        <div className='w-[1476px] mx-auto py-[50px] hidden lg:block'>
          <div className='flex items-center justify-between'>
            <button className='mb-[30px] scale-[1.5] cursor-pointer w-[120px] py-[10px] px-[5px] bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 border-none rounded-[10px] text-white text-[10px]' onClick={() => navigate(-1)}><ArrowLeftOutlined /> Orqaga qaytish</button>
            <button className='mb-[30px] scale-[1.5] cursor-pointer w-[120px] py-[10px] px-[5px] bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 border-none rounded-[10px] text-white text-[10px]' onClick={() => navigate(PATH.allproducts)}><ShoppingOutlined /> Sotuvga qaytish</button>
          </div>
          <h1 className='text-[32px] font-bold mb-[30px] text-center'>{translations.basket.saleTitle}</h1>

          {basketCount > 0 ? (
            <>
              <div className='w-full flex flex-col gap-[20px] mb-[30px]'>
                {Array.isArray(basketItems) && basketItems.length > 0 ? (
                  basketItems.map((item) => (
                    <div 
                      key={`basket-item-${item.id}`} 
                      className='w-full flex items-center justify-between p-[20px] border rounded-[10px] bg-white shadow-lg'
                    >
                      <div className='flex items-center gap-[20px]'>
                        <img src={item.images?.[0] || noImage} alt={item.name} className='w-[100px] h-[100px] object-cover rounded-[10px]' />
                        <div>
                          <h3 className='text-[20px] font-medium mb-[10px]'>{item.name}</h3>
                          <p className='text-[18px] font-medium text-[#3E3E3E] '>
                            {item.price} {translations.basket.sum}
                          </p>
                          <p className='text-[16px] text-gray-600'>
                            {translations.basket.count}: <span className='font-medium text-[#3E3E3E]'>{item.quantity} ta</span>
                          </p>
                          <p className='text-[16px] font-medium text-[#3E3E3E]'>
                            {translations.basket.total}: <span className='text-pink-500'>{(typeof item.price === 'string' ? parseInt(item.price) : item.price) * item.quantity} {translations.basket.sum}</span>
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center gap-[20px] '>
                        <div className='flex items-center gap-2'>
                          <InputNumber
                            min={1}
                            value={item.quantity}
                            onChange={(value) => handleUpdateQuantity(item.id, value || 1)}
                            className='w-[80px]'
                          />
                        </div>
                        <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => handleRemoveFromBasket(item.id)} className='!bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 border-none'> O'chirish </Button>
                      </div>
                    </div>
                  ))
                ) : null}
              </div>
              <div className='w-full flex justify-between items-center p-[20px] border rounded-[10px] bg-white shadow-xl '>
                <div>
                  <h2 className='text-[24px] font-bold '> {translations.basket.total}: <span className='text-pink-500'>{calculateTotal()} {translations.basket.sum}</span> </h2>
                  <p className='text-[16px] text-gray-600'>{translations.basket.total} {basketCount} ta mahsulot</p>
                </div>
                <div>
                  <Button type="primary" size="large" onClick={handlePlaceOrder} className='!bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 border-none'> {translations.basket.toOrder} </Button>
                </div>
              </div>
            </>
          ) : (
            <div className='w-full flex flex-col items-center justify-center py-[100px]'>
              <Empty description={translations.basket.noProductSelected} image={Empty.PRESENTED_IMAGE_SIMPLE} />
              <div>
                <Button onClick={() => navigate(PATH.allproducts)} type='primary' size='large' className='mt-[30px] !bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 border-none' > {translations.basket.backtoSale} </Button>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Desktop Basket  */}

      {/* tablet Basket  */}
      {id ? (
        <div className='w-full mx-auto py-[50px] hidden md:block lg:hidden px-10 overflow-hidden'>
          {product && (
            <div className='w-full flex flex-col gap-[30px]'>
              <div className='w-full flex flex-col-reverse gap-[24px]'>
                <ul className='w-[126px] flex items-center gap-[20px]'>
                  {Array.isArray(product.images) && product.images.length > 0 ? (
                    product.images.map((image, index) => (
                      <li 
                        key={`image-${index}`} 
                        onClick={() => handleThumbnailClick(index)} 
                        className={`w-[80px] h-[80px] rounded-[12px] overflow-hidden cursor-pointer border-2 transition-all ${selectedImageIndex === index ? 'border-blue-500 scale-110' : 'border-gray-200'}`}
                      >
                        <img src={image} alt={`${product.name}-${index}`} className='w-full h-full object-cover' />
                      </li>
                    ))
                  ) : null}
                </ul>
                <div className='w-full h-[300px] relative mb-5 rounded-2xl overflow-hidden border-2 border-black bg-white shadow-lg flex-row'>
                  <img src={product.images[selectedImageIndex]} alt={product.name} className='w-full h-full object-cover' />
                  <button
                    onClick={prevImage}
                    className='absolute cursor-pointer left-4 top-1/2 transform -translate-y-1/2 w-[40px] h-[40px] bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-all'
                  >
                    <LeftOutlined className='text-[20px]' />
                  </button>
                  <button
                    onClick={nextImage}
                    className='absolute cursor-pointer right-4 top-1/2 transform -translate-y-1/2 w-[40px] h-[40px] bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-all'
                  >
                    <RightOutlined className='text-[20px]' />
                  </button>
                </div>
              </div>
              <div className='w-full borde-[2px] border-black rounded-[16px] bg-white shadow-lg shadow-black px-[40px] py-[50px]'>
                <h1 className='text-[32px] font-semibold mb-[39px] text-[#3E3E3E]'>{product.name}</h1>
                <div className='mb-[60px]'>
                  <p className='text-gray-600'>Kompaniya: MarsToys</p>
                  <div className='gap-1 flex flex-col'>
                    <div className='flex items-center gap-[10px]'>
                      <StarFilled className='!text-yellow-400' />
                      <span>{product.average_rating} (1000 baho)</span>
                    </div>
                    <div className='flex items-center gap-[10px]'>
                      <ShoppingOutlined className='!text-yellow-400' />
                      <p className='text-gray-600'>{product.sold} marta sotib olingan</p>
                    </div>
                  </div>
                </div>
                <div className='mb-6'>
                  {product.discounted_price ? (
                    <del className='text-[#D9D9D9] font-medium text-[22px] mb-[4px]'>
                      {product.discounted_price} so'm
                    </del>
                  ) : null}
                  <p className='font-medium text-[32px] text-[#3E3E3E]'>
                    {product.price} so'm
                  </p>
                </div>
                <div className='flex items-center gap-4 mb-6'>
                  <div className='w-full flex items-center border rounded-lg overflow-hidden'>
                    <button
                      onClick={() => setQuantity(prev => Math.max(0, prev - 1))}
                      className='w-[40%] cursor-pointer px-4 py-2 text-[20px] bg-pink-100 hover:bg-pink-200 transition-colors'
                    >
                      -
                    </button>
                    <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 1))} className='w-[20%] text-center border-x py-2' />
                    <button
                      onClick={() => setQuantity(prev => prev + 1)}
                      className='w-[40%] cursor-pointer px-4 py-2 text-[20px] bg-pink-100 hover:bg-pink-200 transition-colors'
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="w-full border-black hover:scale">
                  <Button type="primary" size="large" icon={<ShoppingOutlined />} className='w-full py-[10px] text-[18px] !bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 border-none' onClick={handleAddToBasket}> Savatga qo'shish </Button>
                </div>
              </div>
            </div>
          )}
          <div className='comment w-full flex gap-[24px] mt-[50px] p-0'>
            <div className='w-[1026px] border-[1px] rounded-[16px] border-[#DEDFE7] px-[53px] py-[51px] bg-white shadow-lg'>
              <h2 className='text-[24px] font-bold mb-4'>Mahsulot haqida ma'lumot</h2>
              <p className='text-gray-600'>{product?.description}</p>
            </div>
            <div className='w-[426px] px-[30px] pt-[51px] pb-[30px] rounded-[10px] border-[1px] border-[#DEDFE7] bg-white shadow-lg'>
              <h2 className='font-medium text-[32px] text-[#3E3E3E] mb-[43px]'>Sharhlar</h2>
              <ul className='flex flex-col gap-[44px]'>
                {Array.isArray(commentList) && commentList.length > 0 ? (
                  commentList.map((item: CommentType, index: number) => (
                    <li key={`comment-${index}`} className='w-full'>
                      <div className='flex justify-between mb-[14px]'>
                        <div className='flex flex-col'>
                          <h3 className='font-medium text-[18px] text-[#3E3E3E]'>{item.first_name}</h3>
                          <p className='font-light text-[14px] text-[#3E3E3E]'>{item.created_at}</p>
                        </div>
                        <ul className='flex items-center gap-[3px]'>
                          {[...Array(5)].map((_, i) => (
                            <li key={`star-${i}`} className="hover-rotate">
                              <StarFilled className={i < (item.rating || 0) ? '!text-[#FFC117]' : '!text-[#E0E0E0]'} />
                            </li>
                          ))}
                        </ul>
                      </div>
                      <p className='font-regular text-[16px] text-[#3E3E3E]'>{item.comment}</p>
                    </li>
                  ))
                ) : null}
              </ul>

            </div>
          </div>
        </div>
      ) : (
        <div className='w-full mx-auto py-[50px] hidden md:block lg:hidden px-10'>
          <div className='w-full flex items-center justify-between mb-[30px]'>
            <button className='scale-[1.5] cursor-pointer w-[120px] py-[10px] px-[5px] bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 border-none rounded-[10px] text-white text-[10px]' onClick={() => navigate(-1)}><ArrowLeftOutlined /> Orqaga qaytish</button>
            <button className='scale-[1.5] cursor-pointer w-[120px] py-[10px] px-[5px] bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 border-none rounded-[10px] text-white text-[10px]' onClick={() => navigate(PATH.allproducts)}><ShoppingOutlined /> Sotuvga qaytish</button>
          </div>
          <h1 className='text-[32px] font-bold mb-[30px] text-center'>{translations.basket.saleTitle}</h1>

          {basketCount > 0 ? (
            <>
              <div className='w-full flex flex-col gap-[20px] mb-[30px]'>
                {Array.isArray(basketItems) && basketItems.length > 0 ? (
                  basketItems.map((item) => (
                    <div 
                      key={`basket-item-${item.id}`} 
                      className='w-full flex items-center justify-between p-[20px] border rounded-[10px] bg-white shadow-lg'
                    >
                      <div className='flex items-center gap-[20px]'>
                        <img src={item.images?.[0] || noImage} alt={item.name} className='w-[100px] h-[100px] object-cover rounded-[10px]' />
                        <div>
                          <h3 className='text-[20px] font-medium mb-[10px]'>{item.name}</h3>
                          <p className='text-[18px] font-medium text-[#3E3E3E] '>
                            {item.price} {translations.basket.sum}
                          </p>
                          <p className='text-[16px] text-gray-600'>
                            {translations.basket.count}: <span className='font-medium text-[#3E3E3E]'>{item.quantity} ta</span>
                          </p>
                          <p className='text-[16px] font-medium text-[#3E3E3E]'> Jami: <span className='text-pink-500'>{(typeof item.price === 'string' ? parseInt(item.price) : item.price) * item.quantity} so'm</span></p>
                        </div>
                      </div>
                      <div className='flex items-center gap-[20px] '>
                        <div className='flex items-center gap-2'>
                          <InputNumber
                            min={1}
                            value={item.quantity}
                            onChange={(value) => handleUpdateQuantity(item.id, value || 1)}
                            className='w-[80px]'
                          />
                        </div>
                        <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => handleRemoveFromBasket(item.id)} className='!bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 border-none'> O'chirish </Button>
                      </div>
                    </div>
                  ))
                ) : null}
              </div>
              <div className='w-full flex justify-between items-center p-[20px] border rounded-[10px] bg-white shadow-xl '>
                <div>
                  <h2 className='text-[24px] font-bold '> {translations.basket.total}: <span className='text-pink-500'>{calculateTotal()} so'm</span> </h2>
                  <p className='text-[16px] text-gray-600'> {basketCount} ta mahsulot</p>
                </div>
                <div className="">
                  <Button type="primary" size="large" onClick={handlePlaceOrder} className='!bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 border-none'> {translations.basket.toOrder} </Button>
                </div>
              </div>
            </>
          ) : (
            <div className='w-full flex flex-col items-center justify-center py-[100px]'>
              <Empty description="Savat bo'sh" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              <div>
                <Button onClick={() => navigate(PATH.allproducts)} type='primary' size='large' className='mt-[30px] !bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 border-none' > Mahsulotlarni ko'rish </Button>
              </div>
            </div>
          )}
        </div>
      )}
      {/* tablet Basket  */}

      {/* Mobile Basket  */}
      {id ? (
        <div className='w-full mx-auto py-[50px] block md:hidden px-10 overflow-hidden'>
          {product && (
            <div className='w-full flex flex-col gap-[30px]'>
              <div className='w-full flex flex-col-reverse gap-[24px]'>
                <ul className='w-[126px] flex items-center gap-[20px]'>
                  {Array.isArray(product.images) && product.images.length > 0 ? (
                    product.images.map((image, index) => (
                      <li 
                        key={`image-${index}`} 
                        onClick={() => handleThumbnailClick(index)} 
                        className={`w-[80px] h-[80px] rounded-[12px] overflow-hidden cursor-pointer border-2 transition-all ${selectedImageIndex === index ? 'border-blue-500 scale-110' : 'border-gray-200'}`}
                      >
                        <img src={image} alt={`${product.name}-${index}`} className='w-full h-full object-cover' />
                      </li>
                    ))
                  ) : null}
                </ul>
                <div className='w-full h-[300px] relative mb-5 rounded-2xl overflow-hidden border-2 border-black bg-white shadow-lg flex-row'>
                  <img src={product.images[selectedImageIndex]} alt={product.name} className='w-full h-full object-cover' />
                  <button
                    onClick={prevImage}
                    className='absolute cursor-pointer left-4 top-1/2 transform -translate-y-1/2 w-[40px] h-[40px] bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-all'
                  >
                    <LeftOutlined className='text-[20px]' />
                  </button>
                  <button
                    onClick={nextImage}
                    className='absolute cursor-pointer right-4 top-1/2 transform -translate-y-1/2 w-[40px] h-[40px] bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-all'
                  >
                    <RightOutlined className='text-[20px]' />
                  </button>
                </div>
              </div>
              <div className='w-full borde-[2px] border-black rounded-[16px] bg-white shadow-lg shadow-black px-[20px] py-[20px]'>
                <h1 className='text-[23px] font-semibold mb-[39px] text-[#3E3E3E]'>{product.name}</h1>
                <div className='mb-[60px]'>
                  <p className='text-gray-600'>{translations.basket.company}: MarsToys</p>
                  <div className='gap-1 flex flex-col'>
                    <div className='flex items-center gap-[10px]'>
                      <StarFilled className='!text-yellow-400' />
                      <span>{product.average_rating} ({product.sold} {translations.basket.timesSold})</span>
                    </div>
                    <div className='flex items-center gap-[10px]'>
                      <ShoppingOutlined className='!text-yellow-400' />
                      <p className='text-gray-600'>{product.sold} {translations.basket.timesSold}</p>
                    </div>
                  </div>
                </div>
                <div className='mb-6'>
                  {product.discounted_price ? (
                    <del className='text-[#D9D9D9] font-medium text-[22px] mb-[4px]'>
                      {product.discounted_price} {translations.basket.sum}
                    </del>
                  ) : null}
                  <p className='font-medium text-[32px] text-[#3E3E3E]'>
                    {product.price} {translations.basket.sum}
                  </p>
                </div>
                <div className='flex items-center gap-4 mb-6'>
                  <div className='w-full flex items-center border rounded-lg overflow-hidden'>
                    <button
                      onClick={() => setQuantity(prev => Math.max(0, prev - 1))}
                      className='w-[40%] cursor-pointer px-4 py-2 text-[20px] bg-pink-100 hover:bg-pink-200 transition-colors'
                    >
                      -
                    </button>
                    <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 1))} className='w-[20%] text-center border-x py-2' />
                    <button
                      onClick={() => setQuantity(prev => prev + 1)}
                      className='w-[40%] cursor-pointer px-4 py-2 text-[20px] bg-pink-100 hover:bg-pink-200 transition-colors'
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="w-full border-black hover:scale">
                  <Button type="primary" size="large" icon={<ShoppingOutlined />} className='w-full py-[10px] text-[18px] !bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 border-none' onClick={handleAddToBasket}> {translations.basket.addToCart} </Button>
                </div>
              </div>
            </div>
          )}
          <div className='w-full flex flex-col gap-[24px] mt-[50px] p-0'>
            <div className='w-full border-[1px] rounded-[16px] border-[#DEDFE7] p-6 bg-white shadow-lg'>
              <h2 className='text-[24px] font-bold mb-4'>{translations.basket.commentTitle}</h2>
              <p className='text-gray-600'>{product?.description}</p>
            </div>
            <div className='w-full px-[30px] pt-[51px] pb-[30px] rounded-[10px] border-[1px] border-[#DEDFE7] bg-white shadow-lg'>
              <h2 className='font-medium text-[32px] text-[#3E3E3E] mb-[43px]'>{translations.basket.comment}</h2>
              <ul className='flex flex-col gap-[44px]'>
                {Array.isArray(commentList) && commentList.length > 0 ? (
                  commentList.map((item: CommentType, index: number) => (
                    <li key={`comment-${index}`} className='w-full'>
                      <div className='flex justify-between mb-[14px]'>
                        <div className='flex flex-col'>
                          <h3 className='font-medium text-[18px] text-[#3E3E3E]'>{item.first_name}</h3>
                          <p className='font-light text-[14px] text-[#3E3E3E]'>{item.created_at}</p>
                        </div>
                        <ul className='flex items-center gap-[3px]'>
                          {[...Array(5)].map((_, i) => (
                            <li key={`star-${i}`} className="hover-rotate">
                              <StarFilled className={i < (item.rating || 0) ? '!text-[#FFC117]' : '!text-[#E0E0E0]'} />
                            </li>
                          ))}
                        </ul>
                      </div>
                      <p className='font-regular text-[16px] text-[#3E3E3E]'>{item.comment}</p>
                    </li>
                  ))
                ) : null}
              </ul>

            </div>
          </div>
        </div>
      ) : (
        <div className='w-full mx-auto py-[50px] block md:hidden px-6'>
          <h1 className='text-[32px] font-bold mb-[30px] text-center'>{translations.basket.saleTitle}</h1>
          <div className='w-full flex items-center justify-between mb-[30px]'>
            <button className='cursor-pointer w-[130px] py-[15px] px-[5px] bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 border-none rounded-[10px] text-white text-[13px]' onClick={() => navigate(PATH.allproducts)}><ArrowLeftOutlined /> {translations.basket.backtoButton}</button>
            <button className='cursor-pointer w-[130px] py-[15px] px-[5px] bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 border-none rounded-[10px] text-white text-[13px]' onClick={() => navigate(PATH.allproducts)}><ShoppingOutlined /> {translations.basket.backtoSale}</button>
          </div>

          {basketCount > 0 ? (
            <>
              <div className='w-full flex flex-col gap-[20px] mb-[30px]'>
                {Array.isArray(basketItems) && basketItems.length > 0 ? (
                  basketItems.map((item) => (
                    <div 
                      key={`basket-item-${item.id}`} 
                      className='w-full flex items-center justify-between p-[20px] border rounded-[10px] bg-white shadow-lg'
                    >
                      <div className='flex items-center gap-[20px]'>
                        <img src={item.images?.[0] || noImage} alt={item.name} className='w-[100px] h-[100px] object-cover rounded-[10px]' />
                        <div>
                          <h3 className='text-[20px] font-medium mb-[10px]'>{item.name}</h3>
                          <p className='text-[18px] font-medium text-[#3E3E3E] '> {item.price} {translations.basket.sum} </p>
                          <p className='text-[16px] text-gray-600'>{translations.basket.count}: <span className='font-medium text-[#3E3E3E]'>{item.quantity} ta</span></p>
                          <p className='text-[16px] font-medium text-[#3E3E3E]'> {translations.basket.total}: <span className='text-pink-500'>{(typeof item.price === 'string' ? parseInt(item.price) : item.price) * item.quantity} so'm</span></p>
                        </div>
                      </div>
                      <div className='flex items-center gap-[20px] '>
                        <div className='flex items-center gap-2'>
                          <InputNumber min={1} value={item.quantity} onChange={(value) => handleUpdateQuantity(item.id, value || 1)} className='w-[80px]' />
                        </div>
                        <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => handleRemoveFromBasket(item.id)} className='!bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 border-none'> O'chirish </Button>
                      </div>
                    </div>
                  ))
                ) : null}
              </div>
              <div className='w-full flex flex-col py-[20px] px-[10px] border rounded-[10px] bg-white shadow-xl'>
                <div className='w-full flex items-center flex-col text-left'>
                  <h2 className='text-[24px] font-bold'> {translations.basket.total}: <span className='text-pink-500'>{calculateTotal()} {translations.basket.sum}</span> </h2>
                  <p className='text-[16px] text-gray-600'>{basketCount} {translations.basket.count}</p>
                </div>
                <Button type="primary" size="large" onClick={handlePlaceOrder} className='max-w-[200px] mt-[20px] !bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 border-none'> {translations.basket.toOrder} </Button>
              </div>
            </>
          ) : (
            <div className='w-full flex flex-col items-center justify-center py-[100px]'>
              <Empty description={translations.basket.noProductSelected} image={Empty.PRESENTED_IMAGE_SIMPLE} />
              <div>
                <Button onClick={() => navigate(PATH.allproducts)} type='primary' size='large' className='max-w-[200px] mt-[30px] !bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 border-none' > {translations.basket.backtoSale} </Button>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Mobile Basket  */}

    </div>
  )
}

export default Basket
