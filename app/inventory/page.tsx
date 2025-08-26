"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2 } from "lucide-react"

type InventoryItem = {
  id: number
  name: string
  quantity: number
  unit: string
  category: string
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: 1, name: "商品A", quantity: 100, unit: "个", category: "电子产品" },
    { id: 2, name: "商品B", quantity: 50, unit: "箱", category: "食品" },
    { id: 3, name: "商品C", quantity: 200, unit: "件", category: "服装" },
  ])
  const [newItem, setNewItem] = useState<Omit<InventoryItem, "id">>({ name: "", quantity: 0, unit: "", category: "" })
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)

  const addNewItem = () => {
    if (newItem.name && newItem.quantity && newItem.unit && newItem.category) {
      setInventory([...inventory, { ...newItem, id: inventory.length + 1 }])
      setNewItem({ name: "", quantity: 0, unit: "", category: "" })
    }
  }

  const updateItem = () => {
    if (editingItem) {
      setInventory(inventory.map((item) => (item.id === editingItem.id ? editingItem : item)))
      setEditingItem(null)
    }
  }

  const deleteItem = (id: number) => {
    setInventory(inventory.filter((item) => item.id !== id))
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">仓库管理</h1>
      <Card>
        <CardHeader>
          <CardTitle>库存列表</CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mb-4 btn-3d">
                <Plus className="mr-2" /> 添加新物品
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>添加新物品</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    名称
                  </Label>
                  <Input
                    id="name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="quantity" className="text-right">
                    数量
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: Number.parseInt(e.target.value) })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="unit" className="text-right">
                    单位
                  </Label>
                  <Input
                    id="unit"
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    类别
                  </Label>
                  <Input
                    id="category"
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <Button onClick={addNewItem}>添加物品</Button>
            </DialogContent>
          </Dialog>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>名称</TableHead>
                <TableHead>数量</TableHead>
                <TableHead>单位</TableHead>
                <TableHead>类别</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" onClick={() => setEditingItem(item)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>编辑物品</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-name" className="text-right">
                              名称
                            </Label>
                            <Input
                              id="edit-name"
                              value={editingItem?.name}
                              onChange={(e) =>
                                setEditingItem(editingItem ? { ...editingItem, name: e.target.value } : null)
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-quantity" className="text-right">
                              数量
                            </Label>
                            <Input
                              id="edit-quantity"
                              type="number"
                              value={editingItem?.quantity}
                              onChange={(e) =>
                                setEditingItem(
                                  editingItem ? { ...editingItem, quantity: Number.parseInt(e.target.value) } : null,
                                )
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-unit" className="text-right">
                              单位
                            </Label>
                            <Input
                              id="edit-unit"
                              value={editingItem?.unit}
                              onChange={(e) =>
                                setEditingItem(editingItem ? { ...editingItem, unit: e.target.value } : null)
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-category" className="text-right">
                              类别
                            </Label>
                            <Input
                              id="edit-category"
                              value={editingItem?.category}
                              onChange={(e) =>
                                setEditingItem(editingItem ? { ...editingItem, category: e.target.value } : null)
                              }
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <Button onClick={updateItem}>更新物品</Button>
                      </DialogContent>
                    </Dialog>
                    <Button variant="ghost" onClick={() => deleteItem(item.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
