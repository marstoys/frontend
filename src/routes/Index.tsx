import { Route, Routes } from 'react-router-dom'
import { PATH } from '../hook/usePath'
import Home from '../pages/Home'
import AllProducts from '../pages/AllProducts'
import Basket from '../pages/Basket'
import Orders from '../pages/Orders'
import SaleInfo from '../pages/SaleInfo'

const ToysRoutes = () => {
  return (
    <Routes>
      <Route element={<Home />} path={PATH.home} />
      <Route element={<AllProducts />} path={PATH.allproducts} />
      <Route element={<Orders />} path={PATH.orders} />
      <Route element={<Basket />} path={`${PATH.basket}/:id`}/>
      <Route element={<Basket />} path={`${PATH.basket}`}/>
      <Route element={<SaleInfo />} path={`${PATH.saleInfo}`}/>
    </Routes>
  )
}

export default ToysRoutes
