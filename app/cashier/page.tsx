"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Trash2, CreditCard, DollarSign } from "lucide-react"

type Product = {
  id: number
  name: string
  price: number
  quantity: number
}

type Order = {
  id: number
  products: Product[]
  total: number
  status: "pending" | "completed"
  paymentMethod: "cash" | "card"
}

export default function CashierPage() {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "商品A", price: 10, quantity: 0 },
    { id: 2, name: "商品B", price: 15, quantity: 0 },
    { id: 3, name: "商品C", price: 20, quantity: 0 },
  ])
  const [orders, setOrders] = useState<Order[]>([])
  const [currentOrder, setCurrentOrder] = useState<Product[]>([])
  const [newProduct, setNewProduct] = useState({ name: "", price: "" })

  const addToOrder = (product: Product) => {
    const existingProduct = currentOrder.find((p) => p.id === product.id)
    if (existingProduct) {
      setCurrentOrder(currentOrder.map((p) => (p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p)))
    } else {
      setCurrentOrder([...currentOrder, { ...product, quantity: 1 }])
    }
  }

  const removeFromOrder = (productId: number) => {
    setCurrentOrder(currentOrder.filter((p) => p.id !== productId))
  }

  const calculateTotal = () => {
    return currentOrder.reduce((total, product) => total + product.price * product.quantity, 0)
  }

  const completeOrder = (paymentMethod: "cash" | "card") => {
    const newOrder: Order = {
      id: orders.length + 1,
      products: currentOrder,
      total: calculateTotal(),
      status: "completed",
      paymentMethod: paymentMethod,
    }
    setOrders([...orders, newOrder])
    setCurrentOrder([])
  }

  const addNewProduct = () => {
    if (newProduct.name && newProduct.price) {
      const newProductObj: Product = {
        id: products.length + 1,
        name: newProduct.name,
        price: Number.parseFloat(newProduct.price),
        quantity: 0,
      }
      setProducts([...products, newProductObj])
      setNewProduct({ name: "", price: "" })
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">收银管理</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>商品列表</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {products.map((product) => (
                <Button key={product.id} onClick={() => addToOrder(product)} className="btn-3d">
                  {product.name} - ¥{product.price}
                </Button>
              ))}
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full btn-3d">
                  <Plus className="mr-2" /> 添加新商品
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>添加新商品</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      商品名称
                    </Label>
                    <Input
                      id="name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">
                      价格
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <Button onClick={addNewProduct}>添加商品</Button>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>当前订单</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>商品</TableHead>
                  <TableHead>数量</TableHead>
                  <TableHead>价格</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentOrder.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>¥{product.price * product.quantity}</TableCell>
                    <TableCell>
                      <Button variant="ghost" onClick={() => removeFromOrder(product.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4">
              <p className="text-xl font-bold">总计: ¥{calculateTotal()}</p>
            </div>
            <div className="mt-4 flex space-x-2">
              <Button onClick={() => completeOrder("cash")} className="flex-1 btn-3d">
                <DollarSign className="mr-2" /> 现金支付
              </Button>
              <Button onClick={() => completeOrder("card")} className="flex-1 btn-3d">
                <CreditCard className="mr-2" /> 刷卡支付
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>订单历史</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>订单ID</TableHead>
                <TableHead>总金额</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>支付方式</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>¥{order.total}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{order.paymentMethod === "cash" ? "现金" : "刷卡"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
