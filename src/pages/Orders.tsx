import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
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
  phone_number: string | null,
  address: string,
  total_price: string | number,
  payment_method: string,
  items: {
    product_detail: {
      id: number,
      image: string[],
      price: number,
      title: string
    },
    quantity: number
  }[]
}

const Orders = () => {
  const { token } = useBasket()
  const [isActive, setIsActive] = useState(false)
  const [isloading, setIsLoading] = useState<boolean>(false)
  const [getOrder, setGetOrder] = useState<LastOrderType[]>([])
  const { translations, language } = useLanguage();

  useEffect(() => {
    if (!token) return;

    setIsLoading(true);
    const langQuery = language === 'uz' ? '' : `?lang=${language}`;

    instance.get(`shop/order-history/${langQuery}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setGetOrder(res.data);
      const hasPending = res.data?.some((item: LastOrderType) => item.status === "pending");
      setIsActive(hasPending);
    }).catch(error => {
      console.error("Error fetching orders:", error);
    }).finally(() => {
      setIsLoading(false);
    });
  }, [token, language]);

  const filteredOrders = getOrder.filter(order =>
    isActive ? order.status === "pending" : true
  );


  console.log(getOrder);
  return (
    <div>
      <Header />
      {/* Desktop Responsive */}
{isloading ?
  <div className='w-[1000px] h-[40vh] hidden lg:block mx-auto relative'>
    <div className='absolute right-[50%] top-[20%]'>
      <Spin size='large' className='scale-[2]' />
    </div>
  </div>
  :
  <div className='max-w-[1000px] mx-auto hidden lg:block'>
    <div className='mt-[40px] flex items-center gap-[30px] px-2'>
      <button
        onClick={() => setIsActive(false)}
        className={`w-[220px] py-[8px] font-regular text-[22px] rounded-[20px] ${isActive ? "bg-[#EEEEEE] text-[#3E3E3E]" : "bg-black text-white"}`}
      >
        {translations.order.allOrder}
      </button>
      <button
        onClick={() => setIsActive(true)}
        className={`w-[140px] py-[8px] font-regular text-[22px] rounded-[20px] ${isActive ? "bg-black text-white" : "bg-[#EEEEEE] text-[#3E3E3E]"}`}
      >
        {translations.order.active}
      </button>
    </div>
    <ul className='w-full mt-[15px] flex items-center flex-wrap justify-between px-2 overflow-hidden'>
      {filteredOrders && filteredOrders.length > 0 && filteredOrders.map((item: LastOrderType) => (
        <li key={`order-${item.id}`} className='w-full border-[1px] border-[#D9D9D9] mb-[30px] rounded-[18px]'>
          <div className='w-full border-b-[1px] border-[#D9D9D9] py-[10px] flex flex-col px-[15px]'>
            <div className='flex items-center gap-[10px]'>
              <span className='font-regular text-[18px] text-[#3E3E3E]'>{translations.order.BuyerName}</span>
              <strong className='font-medium text-[20px] text-[#3E3E3E]'>{item.buyer_name} {item.buyer_surname}</strong>
            </div>
            <div className='flex items-center gap-[10px]'>
              <span className='font-regular text-[18px] text-[#3E3E3E]'>{translations.order.ProductName}</span>
              <strong className='font-medium text-[20px] text-[#3E3E3E]'>{item.items[0]?.product_detail.title}</strong>
            </div>
          </div>
          <ul className='flex flex-col gap-[20px] p-4'>
            <li className='w-full flex items-center justify-between'>
              <span className='font-regular text-[18px] text-[#3E3E3E]'>{translations.order.status}</span>
              <strong className='font-medium text-[18px] text-[#52EA17] text-left'>
                {item.status === "pending" ? translations.order.active : "Delivered"}
              </strong>
            </li>
            <li className='w-full flex items-center justify-between'>
              <span className='font-regular text-[18px] text-[#3E3E3E]'>{translations.order.deliveryDate}</span>
              <strong className='line-clamp-1 font-medium text-[18px] text-[#3E3E3E]'>{item.updated_at}</strong>
            </li>
            <li className='w-full flex items-center justify-between'>
              <span className='font-regular text-[18px] text-[#3E3E3E]'>{translations.order.submittedAddress}</span>
              <strong className='line-clamp-1 font-medium text-[18px] text-[#3E3E3E]'>{item.address}</strong>
            </li>
            <li className='w-full flex items-center justify-between'>
              <span className='font-regular text-[18px] text-[#3E3E3E]'>{translations.order.totalPrice}</span>
              <strong className='font-medium text-[18px] text-[#3E3E3E]'>{item.total_price} {translations.basket.sum}</strong>
            </li>
          </ul>
          <div className="w-full border-t pt-4 pb-6">
            <h3 className="font-medium text-lg text-[#3E3E3E] ml-6">
              {item.items.length} {translations.order.productCount}
            </h3>
            <ul className="w-full flex items-center gap-3 mt-4 px-2 overflow-x-auto">
              {item?.items.map((orderItem, index) => (
                <li key={index} className="w-[300px] flex flex-col md:flex-row items-center md:items-start bg-white border-[1px] rounded-lg py-3 shadow-sm hover:shadow-md transition overflow-hidden">
                  <img className="w-[120px] h-[90px] object-cover rounded-lg" src={`${item.items[0]?.product_detail.image}`} alt={orderItem.product_detail.title} />
                  <div className="flex flex-col gap-2 mt-3 md:mt-0 md:ml-4 w-full">
                    <div className="w-full flex gap-1 items-center">
                      <strong className="text-lg text-gray-700">{translations.order.name}:</strong>
                      <p className="text-lg font-medium text-gray-900 line-clamp-1">{orderItem.product_detail.title}</p>
                    </div>

                    <div className="flex gap-1 items-center">
                      <strong className="text-lg text-gray-700">{translations.order.price}:</strong>
                      <p className="text-lg font-medium text-gray-900">{orderItem.product_detail.price}</p>
                    </div>
                    <div className="flex gap-1 items-center">
                      <strong className="text-lg text-gray-700">{translations.order.quantity}:</strong>
                      <p className="text-lg font-medium text-gray-900">{orderItem.quantity} {translations.order.count}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
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
          <ul className='w-full mt-[30px] flex items-center flex-wrap justify-between overflow-hidden'>
            {filteredOrders && filteredOrders.length > 0 && filteredOrders.map((item: LastOrderType) => (
              <li key={`order-${item.id}`} className='w-full border-[2px] border-[#D9D9D9] mb-[50px] rounded-[30px]'>
                <div className='w-full border-b-[1px] border-[#D9D9D9] py-[25px] flex flex-col px-[32px]'>
                  <div className='flex items-center gap-[20px]'>
                    <span className='font-regular text-[23px] text-[#3E3E3E]'>{translations.order.BuyerName}</span>
                    <strong className='font-medium text-[20px] text-[#3E3E3E]'>{item.buyer_name} {item.buyer_surname}</strong>
                  </div>
                  <div className='flex items-center gap-[20px]'>
                    <span className='font-regular text-[23px] text-[#3E3E3E]'>{translations.order.ProductName}</span>
                    <strong className='font-medium text-[20px] text-[#3E3E3E]'>{item.items[0]?.product_detail.title}</strong>
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
                <div className="w-full border-t pt-8 pb-12">
                  <h3 className="font-medium text-2xl text-[#3E3E3E] ml-10">
                    {item.items.length} {translations.order.productCount}
                  </h3>
                  <ul className="w-full flex flex-col gap-6 mt-6 px-5 overflow-x-auto">
                    {item?.items.map((orderItem) => (
                      <li key={orderItem.product_detail.id} className="w-[400px] flex flex-col md:flex-row items-center md:items-start bg-white border rounded-2xl py-4 px-1 shadow-sm hover:shadow-md transition" >
                        <img className="w-[154px] h-[150px] object-cover rounded-xl" src={`${item.items[0]?.product_detail.image}`} alt={orderItem.product_detail.title} width={174} height={225} />
                        <div className="flex flex-col gap-4 mt-4 md:mt-0 md:ml-6 w-full">
                          <div className="w-full flex gap-2 items-center">
                            <strong className="text-[16px] text-gray-700">{translations.order.name}:</strong>
                            <p className="text-[16px] font-medium text-gray-900 line-clamp-1">{orderItem.product_detail.title}</p>
                          </div>

                          <div className="w-full flex gap-2 items-center">
                            <strong className="text-[16px] text-gray-700">{translations.order.price}:</strong>
                            <p className="text-[16px] font-medium text-gray-900">${orderItem.product_detail.price}</p>
                          </div>
                          <div className="w-full flex gap-2 items-center">
                            <strong className="text-[16px] text-gray-700">{translations.order.quantity}:</strong>
                            <p className="text-[16px] font-medium text-gray-900">{orderItem.quantity} {translations.order.count}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
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
            {filteredOrders && filteredOrders.length > 0 && filteredOrders.map((item: LastOrderType) => (
              <li key={`order-${item.id}`} className='w-full border-[2px] border-[#D9D9D9] mb-[50px] rounded-[30px]'>
                <div className='w-full border-b-[1px] border-[#D9D9D9] py-[15px] flex flex-col px-[15px]'>
                  <div className='flex items-center justify-between'>
                    <span className='font-regular text-[11px] text-[#3E3E3E]'>{translations.order.BuyerName}</span>
                    <strong className='font-medium text-[13px] text-[#3E3E3E]'>{item.buyer_name} {item.buyer_surname}</strong>
                  </div>
                  <div className='w-[100%] flex items-center justify-between'>
                    <span className='w-[32%] font-regular text-[11px] text-[#3E3E3E]'>{translations.order.ProductName}</span>
                    <strong className='w-[68%] font-medium text-[13px] text-[#3E3E3E] line-clamp-1'>{item.items[0]?.product_detail.title}</strong>
                  </div>
                </div>
                <ul className='flex flex-col gap-5 p-5'>
                  <li className='w-full flex items-center justify-between'>
                    <span className='font-regular text-[14px] text-[#3E3E3E]'>{translations.order.status}</span>
                    <strong className='font-medium text-[18px] text-[#52EA17] text-center'>
                      {item.status === "pending" ? "Jarayonda" : "Yetkazilgan"}
                    </strong>
                  </li>
                  <li className='w-full flex items-center justify-between'>
                    <span className='font-regular text-[14px] text-[#3E3E3E]'>{translations.order.deliveryDate}</span>
                    <strong className='line-clamp-1 font-medium text-[18px] text-[#3E3E3E]'>{item.updated_at}</strong>
                  </li>
                  <li className='w-full flex items-center justify-between'>
                    <span className='font-regular text-[14px] text-[#3E3E3E]'>{translations.order.submittedAddress}</span>
                    <strong className='font-medium text-[14px] text-[#3E3E3E] line-clamp-1'>{item.address}</strong>
                  </li>
                  <li className='w-full flex items-center justify-between'>
                    <span className='font-regular text-[14px] text-[#3E3E3E]'>{translations.order.totalPrice}</span>
                    <strong className='font-medium text-[14px] text-[#3E3E3E]'>{item.total_price}</strong>
                  </li>
                </ul>
                <div className="w-full border-t-[2px] py-5">
                  <h3 className="font-medium text-[15px] text-[#3E3E3E] ml-5">
                    {item.items.length} {translations.order.productCount}
                  </h3>
                  <ul className="w-full flex flex-col gap-6 mt-6 px-5 h-[40vh] overflow-y-auto">
                    {item?.items.map((orderItem) => (
                      <li key={orderItem.product_detail.id} className="w-full text-center cursor-pointer flex flex-col md:flex-row items-center md:items-start bg-white border rounded-2xl py-4 px-1 shadow-sm hover:shadow-md transition" >
                        <img className="w-full h-[170px] object-cover rounded-xl" src={`${item.items[0]?.product_detail.image}`} alt={orderItem.product_detail.title} width={174} height={225} />
                        <div className="flex flex-col gap-4 mt-4 w-full px-5">
                          <div className="w-full flex gap-2 items-center">
                            <strong className="text-[12px] text-gray-700">{translations.order.name}:</strong>
                            <p className="text-[12px] font-medium text-gray-900 line-clamp-1">{orderItem.product_detail.title}</p>
                          </div>

                          <div className="w-full flex gap-2 items-center">
                            <strong className="text-[12px] text-gray-700">{translations.order.price}:</strong>
                            <p className="text-[12px] font-medium text-gray-900">${orderItem.product_detail.price}</p>
                          </div>
                          <div className="w-full flex gap-2 items-center">
                            <strong className="text-[12px] text-gray-700">{translations.order.quantity}:</strong>
                            <p className="text-[12px] font-medium text-gray-900">{orderItem.quantity} {translations.order.count}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
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
