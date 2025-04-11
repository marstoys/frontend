import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductImg from "../assets/images/productImg.png"
import { useBasket } from '../Context/Context'
import { instance } from '../hook/Instance'
import { Spin } from 'antd'
import { useLanguage } from '../Context/LanguageContext'

interface LastOrderType {
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
  items: OrderProductListType[]
}

export interface OrderProductListType {
  id?: number,
  image: string[],
  price: number,
  title: string
}

interface OrderItem {
  product_detail: OrderProductListType,
  quantity: number
}

const Orders = () => {
  const { token } = useBasket()
  const [isActive, setIsActive] = useState(false)
  const [isloading, setIsLoading] = useState<boolean>(false)
  const [getOrder, setGetOrder] = useState<LastOrderType[]>([])
  const [mainList, setMainList] = useState<OrderItem[]>([]);
  const { translations } = useLanguage();

  useEffect(() => {
    setIsLoading(true)
    instance.get(`shop/order-history/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => {
      setGetOrder(res.data);
      setMainList(res.data?.map((item: LastOrderType) => item.items));
      const hasPending = res.data?.some((item: LastOrderType) => item.status === "pending");
      setIsActive(hasPending);
      setIsLoading(false)
    }).catch(error => {
      console.error("Error fetching orders:", error);
      setIsLoading(false);
    });
  }, [token])

  const filteredOrders = getOrder.filter(order => 
    isActive ? order.status === "pending" : true
  );

  return (
    <div>
      <Header />
      {/* Desktop Responsive */}
      {isloading ?
        <div className='w-[1476px] h-[40vh] hidden lg:block mx-auto relative'>
          <div className='absolute right-[50%] top-[20%]'> <Spin size='large' className='scale-[5]' /></div>
        </div>
        :
        <div className='w-[1476px] mx-auto hidden lg:block'>
          <div className='mt-[77px] flex items-center gap-[77px]'>
            <button onClick={() => setIsActive(false)} className={`w-[300px] py-[12px] font-regular text-[30px] rounded-[32px] ${isActive ? "bg-[#EEEEEE] text-[#3E3E3E]" : "bg-black text-white"}`}>
              {translations.order.allOrder}
            </button>
            <button onClick={() => setIsActive(true)} className={`w-[174px] py-[12px] font-regular text-[30px] rounded-[32px] ${isActive ? "bg-black text-white" : "bg-[#EEEEEE] text-[#3E3E3E]"}`}>
              {translations.order.active}
            </button>
          </div>
          <ul className='w-full mt-[30px] flex items-center flex-wrap justify-between'>
            {filteredOrders?.map((item: LastOrderType) => (
              <li key={item.id} className='w-full border-[2px] border-[#D9D9D9] mb-[50px] rounded-[30px]'>
                <div className='w-full border-b-[1px] border-[#D9D9D9] py-[25px] flex flex-col px-[32px]'>
                  <div className='flex items-center gap-[20px]'>
                    <span className='font-regular text-[26px] text-[#3E3E3E]'>{translations.order.BuyerName}</span>
                    <strong className='font-medium text-[30px] text-[#3E3E3E]'>{item.buyer_name} {item.buyer_surname}</strong>
                  </div>
                  <div className='flex items-center gap-[20px]'>
                    <span className='font-regular text-[26px] text-[#3E3E3E]'>{translations.order.ProductName}</span>
                    <strong className='font-medium text-[30px] text-[#3E3E3E]'>{item.items[0]?.title}</strong>
                  </div>
                </div>
                <ul className='flex flex-col gap-[60px] p-10'>
                  <li className='w-full flex items-center justify-between'>
                    <span className='font-regular text-[26px] text-[#3E3E3E]'>{translations.order.status}</span>
                    <strong className='font-medium text-[26px] text-[#52EA17] text-left'>
                      {item.status === "pending" ? translations.order.active : "Yetkazilgan"}
                    </strong>
                  </li>
                  <li className='w-full flex items-center justify-between'>
                    <span className='font-regular text-[26px] text-[#3E3E3E]'>{translations.order.deliveryDate}</span>
                    <strong className='line-clamp-1 font-medium text-[26px] text-[#3E3E3E]'>{item.updated_at}</strong>
                  </li>
                  <li className='w-full flex items-center justify-between'>
                    <span className='font-regular text-[26px] text-[#3E3E3E]'>{translations.order.submittedAddress}</span>
                    <strong className='line-clamp-1 font-medium text-[26px] text-[#3E3E3E]'>{item.address}</strong>
                  </li>
                  <li className='w-full flex items-center justify-between'>
                    <span className='font-regular text-[26px] text-[#3E3E3E]'>{translations.order.totalPrice}</span>
                    <strong className='font-medium text-[26px] text-[#3E3E3E]'>{item.total_price} {translations.basket.sum}</strong>
                  </li>
                </ul>
              </li>
            ))}
          </ul>
        </div>
      }
      {/* Desktop Responsive */}

      {/* Tablet Responsive */}
      {isloading ?
        <div className='w-full h-[40vh] mx-auto hidden md:block lg:hidden relative'>
          <div className='absolute right-[50%] top-[20%]'> <Spin size='large' className='scale-[5]' /></div>
        </div>
        :
        <div className='w-full mx-auto px-[30px] hidden md:block lg:hidden'>
          <div className='mt-[77px] flex items-center justify-between'>
            <button onClick={() => setIsActive(false)} className={`w-[300px] py-[12px] font-regular text-[30px] rounded-[32px] ${isActive ? "bg-[#EEEEEE] text-[#3E3E3E]" : "bg-black text-white"}`}>{translations.order.allOrder}</button>
            <button onClick={() => setIsActive(true)} className={`w-[174px] py-[12px] font-regular text-[30px] rounded-[32px] ${isActive ? "bg-black text-white" : "bg-[#EEEEEE] text-[#3E3E3E]"}`}>{translations.order.active}</button>
          </div>
          <ul className='w-full mt-[30px] flex items-center flex-wrap justify-between'>
            {filteredOrders?.map((item: LastOrderType) => (
              <li key={item.id} className='w-full border-[2px] border-[#D9D9D9] mb-[50px] rounded-[30px]'>
                <div className='w-full border-b-[1px] border-[#D9D9D9] py-[25px] flex flex-col px-[32px]'>
                  <div className='flex items-center gap-[20px]'>
                    <span className='font-regular text-[26px] text-[#3E3E3E]'>{translations.order.BuyerName}</span>
                    <strong className='font-medium text-[30px] text-[#3E3E3E]'>{item.buyer_name} {item.buyer_surname}</strong>
                  </div>
                  <div className='flex items-center gap-[20px]'>
                    <span className='font-regular text-[26px] text-[#3E3E3E]'>{translations.order.ProductName}</span>
                    <strong className='font-medium text-[30px] text-[#3E3E3E]'>{item.items[0]?.title}</strong>
                  </div>
                </div>
                <ul className='flex flex-col gap-[60px] p-10'>
                  <li className='w-full flex items-center justify-between'>
                    <span className='font-regular text-[26px] text-[#3E3E3E]'>{translations.order.status}</span>
                    <strong className='font-medium text-[26px] text-[#52EA17] text-left'>
                      {item.status === "pending" ? "Jarayonda" : "Yetkazilgan"}
                    </strong>
                  </li>
                  <li className='w-full flex items-center justify-between'>
                    <span className='font-regular text-[26px] text-[#3E3E3E]'>{translations.order.deliveryDate}</span>
                    <strong className='line-clamp-1 font-medium text-[26px] text-[#3E3E3E]'>{item.updated_at}</strong>
                  </li>
                  <li className='w-full flex items-center justify-between'>
                    <span className='font-regular text-[26px] text-[#3E3E3E]'>{translations.order.submittedAddress}</span>
                    <strong className='font-medium text-[26px] text-[#3E3E3E]'>{item.address}</strong>
                  </li>
                  <li className='w-full flex items-center justify-between'>
                    <span className='font-regular text-[26px] text-[#3E3E3E]'>{translations.order.totalPrice}</span>
                    <strong className='font-medium text-[26px] text-[#3E3E3E]'>{item.total_price}</strong>
                  </li>
                </ul>
              </li>
            ))}
          </ul>
        </div>
      }
      {/* Tablet Responsive */}

      {/* Mobile Responsive */}
      {isloading ?
        <div className='w-full h-[40vh] block  md:hidden  mx-auto relative'>
          <div className='absolute right-[50%] top-[20%]'> <Spin size='large' className='scale-[5]' /></div>
        </div>
        :
        <div className='w-full mx-auto block  md:hidden px-[30px] overflow-hidden'>
          <div className='w-full mt-[47px] flex items-center justify-between'>
            <button onClick={() => setIsActive(false)} className={`w-[220px] py-[8px] font-regular text-[20px] rounded-[32px] ${isActive ? "bg-[#EEEEEE] text-[#3E3E3E]" : "bg-black text-white"}`}>Barcha buyurtmalar</button>
            <button onClick={() => setIsActive(true)} className={`w-[100px] py-[8px] font-regular text-[20px] rounded-[32px] ${isActive ? "bg-black text-white" : "bg-[#EEEEEE] text-[#3E3E3E]"}`}>Faol</button>
          </div>
          <ul className='w-full mt-[30px] flex items-center flex-wrap justify-between'>
            {filteredOrders?.map((item: LastOrderType) => (
              <li key={item.id} className='w-full border-[2px] border-[#D9D9D9] mb-[50px] rounded-[30px]'>
                <div className='w-full border-b-[1px] border-[#D9D9D9] py-[15px] flex flex-col px-[15px]'>
                  <div className='flex items-center justify-between'>
                    <span className='font-regular text-[13px] text-[#3E3E3E]'>{translations.order.BuyerName}</span>
                    <strong className='font-medium text-[15px] text-[#3E3E3E]'>{item.buyer_name} {item.buyer_surname}</strong>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='font-regular text-[13px] text-[#3E3E3E]'>{translations.order.ProductName}</span>
                    <strong className='font-medium text-[15px] text-[#3E3E3E]'>{item.items[0]?.title}</strong>
                  </div>
                </div>
                <ul className='flex flex-col gap-5 p-5'>
                  <li className='w-full flex items-center justify-between'>
                    <span className='font-regular text-[16px] text-[#3E3E3E]'>{translations.order.status}</span>
                    <strong className='font-medium text-[18px] text-[#52EA17] text-center'>
                      {item.status === "pending" ? "Jarayonda" : "Yetkazilgan"}
                    </strong>
                  </li>
                  <li className='w-full flex items-center justify-between'>
                    <span className='font-regular text-[16px] text-[#3E3E3E]'>{translations.order.deliveryDate}</span>
                    <strong className='line-clamp-1 font-medium text-[18px] text-[#3E3E3E]'>{item.updated_at}</strong>
                  </li>
                  <li className='w-full flex items-center justify-between'>
                    <span className='font-regular text-[16px] text-[#3E3E3E]'>{translations.order.submittedAddress}</span>
                    <strong className='font-medium text-[16px] text-[#3E3E3E]'>{item.address}</strong>
                  </li>
                  <li className='w-full flex items-center justify-between'>
                    <span className='font-regular text-[16px] text-[#3E3E3E]'>{translations.order.totalPrice}</span>
                    <strong className='font-medium text-[16px] text-[#3E3E3E]'>{item.total_price}</strong>
                  </li>
                </ul>
              </li>
            ))}
          </ul>
        </div>
      }
      {/* Mobile Responsive */}

      <Footer />
    </div>
  )
}

export default Orders
