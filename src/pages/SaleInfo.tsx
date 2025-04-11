import React, { FormEvent, useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Image, Spin } from 'antd'
import noImage from "../assets/images/noImage.jpg"
import { ProductsType } from '../components/NewProducts'
import { instance } from '../hook/Instance'
import SiteLogo from "../assets/images/SiteLogo.svg"
import { useBasket } from '../Context/Context'
import { useLanguage } from '../Context/LanguageContext'


interface OrderItem {
  id: number;
  items: (ProductsType & { quantity: number })[];
  totalPrice: number;
  date: string;
}
interface SimpleOrderItem {
  product: number;
  quantity: number;
}
export interface LastOrderType {
  id?: string,
  created_at?: string,
  is_paid?: boolean,
  status?: string,
  updated_at?: string,
  buyer_name: string;
  buyer_surname: string;
  Phone_number: string | null,
  address: string,
  total_price: string | number,
  payment_method: string,
  items: SimpleOrderItem[]
}

const SaleInfo = () => {
  const { token, setToken } = useBasket()
  const { translations } = useLanguage();
  const [data, setData] = useState<LastOrderType | undefined>()
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [confirmationCode, setConfirmationCode] = useState<boolean>(false)
  const [usersPhone, setUsersPhone] = useState<string>('1')
  const [isloading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (token && data) {
      setIsLoading(true);
      instance.post(`shop/order-product/`, data, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => {
        window.location.replace(res.data.payment_link);
        localStorage.removeItem("basket");
        localStorage.removeItem("orders");
        setIsLoading(false);
      }).catch(error => {
        console.error("Order error:", error);
        setIsLoading(false);
      });
    }
  }, [token, data]);

  // Form submit
  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders);
      setOrders(parsedOrders);

      // Calculate total price
      const total = parsedOrders.reduce((sum: number, order: OrderItem) => {
        return sum + order.totalPrice;
      }, 0);
      setTotalPrice(total);
    }
  }, []);
  function handleProfileSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    // Get form values directly
    const firstName = (form.elements.namedItem('firstName') as HTMLInputElement).value;
    const lastName = (form.elements.namedItem('lastName') as HTMLInputElement).value;
    const phone = (form.elements.namedItem('phone') as HTMLInputElement).value;
    const address = (form.elements.namedItem('address') as HTMLInputElement).value;

    const simpleItems: SimpleOrderItem[] = orders.flatMap(Ordersitem =>
      Ordersitem.items?.map(item => ({
        product: item.id,
        quantity: item.quantity
      }))
    );

    // Create LastData with direct form values
    const LastData: LastOrderType = {
      buyer_name: firstName,
      buyer_surname: lastName,
      Phone_number: phone,
      address: address,
      total_price: totalPrice,
      payment_method: 'karta',
      items: simpleItems
    }

    // Set data with the direct values
    setData(LastData);

    // If user has token, proceed directly to order
    if (token) {
      return;
    }

    // If no token, proceed with registration
    setConfirmationCode(true);
    setUsersPhone(phone);
    const Verifydata: { phone_number: string; } = {
      phone_number: phone,
    };

    instance.post(`users/register/`, Verifydata).then(res => {
      console.log(res.data);
    })
  }
  // Form submit

  // ConfirmationCode
  function handleConfirmationCode(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    console.log(e);
  }
  // ConfirmationCode

  // Clockdown 
  const [timeLeft, setTimeLeft] = useState(300);
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime === 1) {
          clearInterval(timer);
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function HandleLoginSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const loginData = {
      phone_number: usersPhone,
      otp: (e.target as HTMLFormElement).confirmationCode.value
    }

    // Get the current data value
    const currentData = data;

    instance.post(`users/login/`, loginData).then(res => {
      setConfirmationCode(false)
      // Store both access and refresh tokens
      localStorage.setItem('access_token', res.data.access_token);
      localStorage.setItem('refresh_token', res.data.refresh_token);
      setToken(res.data.access_token);
      setTimeout(() => {
        if (currentData) {
          instance.post(`shop/order-product/`, currentData, {
            headers: { 'Authorization': `Bearer ${res.data.access_token}` }
          }).then(res => {
            window.location.replace(res.data.payment_link);
            localStorage.removeItem("basket");
            localStorage.removeItem("orders");
          })
        }
      }, 100);
    })
  }

  return (
    <div>
      <Header />

      {/* Responsive + Sale Info  */}
      {isloading ?
        <div className='w-[1476px] h-[40vh] mx-auto relative hidden lg:block'>
          <div className='absolute right-[50%] top-[20%]'> <Spin size='large' className='scale-[5]' /></div>
        </div>
        :
        <div className="w-[1476px] mx-auto py-8 px-4 relative hidden lg:block">
          <div className="flex flex-col md:flex-row gap-6 relative">
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <form id='profleForm' onSubmit={handleProfileSubmit}>
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="space-y-2 flex-1">
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        {translations.order.BuyerName}
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="Ismingizni kiriting..."
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2 flex-1">
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        {translations.order.ProductName}
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Familiyangizni kiriting..."
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        {translations.order.phoneNumber}
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="text"
                      placeholder="998 - (__)- ___ - __ - __"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2 mb-6">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      {translations.order.address}
                    </label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      placeholder="Shahar, ko'cha, uy..."
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </form>
              </div>
              {orders.length > 0 && orders[orders.length - 1].items?.map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-24 h-24 relative">
                      <Image
                        src={item.images?.[0] || noImage}
                        alt={item.name}
                        width={100}
                        height={100}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-md font-medium text-gray-700">{item.name}</h4>
                      <p className="text-sm text-gray-500">Miqdori: {item.quantity} dona</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">{item.price} so'm</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="md:w-1/3">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold">{translations.order.allOrder}</h2>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Mahsulotlar ({orders.length > 0 ? orders[orders.length - 1].items.length : 0}) {translations.order.count}</span>
                      <span>{totalPrice} so'm</span>
                    </div>
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="flex justify-between font-semibold">
                        <span>{translations.order.total}</span>
                        <span>{totalPrice} {translations.order.sum}</span>
                      </div>
                    </div>
                    <button
                      type="submit"
                      form='profleForm'
                      className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    >
                      To'lov qilish
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {confirmationCode ?
            <div className='w-full h-[80vh] backdrop-blur-3xl absolute z-40 top-0 left-0'>
              <div className='w-[500px] h-[350px] backdrop-blur-3xl p-5 border-[2px] block mx-auto mt-[100px] border-blue-400 rounded-[20px]'>
                <img className='w-[70px] h-[70px] block mx-auto' src={SiteLogo} alt='siteLogo' width={70} height={70} />
                <form onSubmit={HandleLoginSubmit} className="w-[300px] block mt-10 mx-auto text-sm font-medium text-gray-700 text-center">
                  <p>{translations.saleInfo.verifySms}</p>
                  <p>({timeLeft}) {translations.saleInfo.addVerifyCode}</p>
                  {timeLeft === 0 && <button className='w-[300px] py-[5px] rounded-[10px] border-[1px] border-black mt-[20px] cursor-pointer' onClick={() => setConfirmationCode(false)}>{translations.saleInfo.verifyCodeAdd}</button>}
                  <input onClick={handleConfirmationCode} name="confirmationCode" type='number' placeholder="Tasdiqlash ko'dini kiritish..." required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4" />
                  <button type='submit' className='w-[100px] py-[10px] rounded-[10px] bg-blue-500 text-white mt-[20px] cursor-pointer'>{translations.saleInfo.verifyCodeButtonText}</button>
                </form>
              </div>
            </div> : null
          }
        </div>
      }
      {/* desktop + Sale Info  */}


      {/* tablet + Sale Info  */}
      {isloading ?
        <div className='w-full h-[40vh] mx-auto relative hidden md:block lg:hidden'>
          <div className='absolute right-[50%] top-[20%]'> <Spin size='large' className='scale-[5]' /></div>
        </div>
        :
        <div className="w-full mx-auto py-8 px-4 relative hidden md:block lg:hidden">
          <div className="flex flex-col md:flex-row gap-6 relative">
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <form id='profleForm' onSubmit={handleProfileSubmit}>
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="space-y-2 flex-1">
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        Ism:
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="Ismingizni kiriting..."
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2 flex-1">
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Familiya:
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Familiyangizni kiriting..."
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Telefon raqami:
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="text"
                      placeholder="+998 - (__)- ___ - __ - __"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2 mb-6">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Buyurtmani yetkazish manzili:
                    </label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      placeholder="Shahar, ko'cha, uy..."
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </form>
              </div>
              {orders.length > 0 && orders[orders.length - 1].items?.map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-24 h-24 relative">
                      <Image
                        src={item.images?.[0] || noImage}
                        alt={item.name}
                        width={100}
                        height={100}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-md font-medium text-gray-700">{item.name}</h4>
                      <p className="text-sm text-gray-500">Miqdori: {item.quantity} {translations.order.count}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">{item.price} {translations.order.sum}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="md:w-1/3">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold">{translations.order.allOrder}</h2>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Mahsulotlar ({orders.length > 0 ? orders[orders.length - 1].items.length : 0}) {translations.order.count}</span>
                      <span>{totalPrice} so'm</span>
                    </div>
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="flex justify-between font-semibold">
                        <span>{translations.order.total}</span>
                        <span>{totalPrice} {translations.order.sum}</span>
                      </div>
                    </div>
                    <button
                      type="submit"
                      form='profleForm'
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    >
                      {translations.order.processingOrders}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {confirmationCode ?
            <div className='w-full h-[70vh] backdrop-blur-3xl absolute z-40 top-0 left-0'>
              <div className='w-[500px] h-[350px] backdrop-blur-3xl p-5 border-[2px] block mx-auto mt-[100px] border-blue-400 rounded-[20px]'>
                <img className='w-[70px] h-[70px] block mx-auto' src={SiteLogo} alt='siteLogo' width={70} height={70} />
                <form onSubmit={HandleLoginSubmit} className="w-[300px] block mt-10 mx-auto text-sm font-medium text-gray-700 text-center">
                  <p>{translations.saleInfo.verifySms}</p>
                  <p>({timeLeft}) {translations.saleInfo.addVerifyCode}</p>
                  {timeLeft === 0 && <button className='w-[300px] py-[5px] rounded-[10px] border-[1px] border-black mt-[20px] cursor-pointer' onClick={() => setConfirmationCode(false)}>{translations.saleInfo.verifyCodeAdd}</button>}
                  <input onClick={handleConfirmationCode} name="confirmationCode" type='number' placeholder="Tasdiqlash ko'dini kiritish..." required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4" />
                  <button type='submit' className='w-[100px] py-[10px] rounded-[10px] bg-blue-500 text-white mt-[20px] cursor-pointer'>{translations.saleInfo.verifyCodeButtonText}</button>
                </form>
              </div>
            </div> : null
          }
        </div>
      }
      {/* tablet + Sale Info  */}

      {/* Mobile + Sale Info  */}
      {isloading ?
        <div className='w-full h-[40vh] mx-auto relative block md:hidden'>
          <div className='absolute right-[50%] top-[20%]'> <Spin size='large' className='scale-[5]' /></div>
        </div>
        :
        <div className="w-full mx-auto py-8 px-4 relative block md:hidden">
          <div className="flex flex-col md:flex-row gap-6 relative">
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <form id='profleForm' onSubmit={handleProfileSubmit}>
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="space-y-2 flex-1">
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        {translations.order.BuyerName}
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="Ismingizni kiriting..."
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2 flex-1">
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        {translations.order.ProductName}
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Familiyangizni kiriting..."
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      {translations.order.phoneNumber}
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="text"
                      placeholder="+998 - (__)- ___ - __ - __"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2 mb-6">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      {translations.order.address}
                    </label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      placeholder="Shahar, ko'cha, uy..."
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </form>
              </div>
              {orders.length > 0 && orders[orders.length - 1].items?.map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-24 h-24 relative">
                      <Image
                        src={item.images?.[0] || noImage}
                        alt={item.name}
                        width={100}
                        height={100}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-md font-medium text-gray-700">{item.name}</h4>
                      <p className="text-sm text-gray-500">Miqdori: {item.quantity} {translations.order.count}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">{item.price} {translations.order.sum}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="md:w-1/3">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold">{translations.order.allOrder}</h2>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Mahsulotlar ({orders.length > 0 ? orders[orders.length - 1].items.length : 0}) {translations.order.count}</span>
                      <span>{totalPrice} {translations.order.sum}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="flex justify-between font-semibold">
                        <span>{translations.order.totalPrice}</span>
                        <span>{totalPrice} {translations.order.sum}</span>
                      </div>
                    </div>
                    <button type="submit" form='profleForm' className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"> {translations.order.processingOrders}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {confirmationCode ?
            <div className='w-full h-[70vh] backdrop-blur-3xl absolute z-40 top-0 left-0'>
              <div className='w-[350px] h-[350px] backdrop-blur-3xl p-5 border-[2px] block mx-auto mt-[50px] border-blue-400 rounded-[20px]'>
                <img className='w-[70px] h-[70px] block mx-auto' src={SiteLogo} alt='siteLogo' width={70} height={70} />
                <form onSubmit={HandleLoginSubmit} className="w-[300px] block mt-10 mx-auto text-sm font-medium text-gray-700 text-center">
                  <p>{translations.saleInfo.verifySms}</p>
                  <p>({timeLeft}) {translations.saleInfo.addVerifyCode}</p>
                  {timeLeft === 0 && <button className='w-[300px] py-[5px] rounded-[10px] border-[1px] border-black mt-[20px] cursor-pointer' onClick={() => setConfirmationCode(false)}>{translations.saleInfo.verifyCodeAdd}</button>}
                  <input onClick={handleConfirmationCode} name="confirmationCode" type='number' placeholder="Tasdiqlash ko'dini kiritish..." required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4" />
                  <button type='submit' className='w-[100px] py-[10px] rounded-[10px] bg-blue-500 text-white mt-[20px] cursor-pointer'>{translations.saleInfo.verifyCodeButtonText}</button>
                </form>
              </div>
            </div> : null
          }
        </div>
      }
      {/* Mobile + Sale Info  */}

      <Footer />
    </div>
  )
}

export default SaleInfo
