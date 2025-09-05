import { Button, Card, Form, List, Select, Typography, message, Alert } from 'antd'
import { useEffect, useState } from 'react'
import api from '../api'

const OPTIONS = [
  {value:'AWAITING_AT_WAREHOUSE', label:'Ожидается на складе'},
  {value:'SHIPPED', label:'Отправлено'},
  {value:'WITH_COURIER', label:'У курьера'},
  {value:'DELIVERED', label:'Доставлено'},
]

export default function Admin(){
  const [items,setItems]=useState<any[]>([])
  const [me,setMe]=useState<any>(null)
  const load=()=>api.get('/api/parcels').then(r=>setItems(r.data))
  useEffect(()=>{
    api.get('/api/auth/me').then(r=>setMe(r.data)).catch(()=>setMe(null))
  },[])
  useEffect(()=>{ if(me?.role==='ADMIN') load() },[me])

  if(me && me.role!=='ADMIN'){
    return <Alert type="error" message="Доступ запрещён" description="Требуется роль ADMIN" />
  }

  return <div className="max-w-6xl mx-auto">
    <Typography.Title level={2}>Админ-панель</Typography.Title>
    <Card>
      <List dataSource={items} renderItem={(p:any)=>(
        <List.Item actions={[
          <Form onFinish={(v:any)=>api.patch(`/api/parcels/${p.id}/status`, { status: v.status }).then(()=>{message.success('Статус обновлён'); load()})} layout="inline">
            <Form.Item name="status" initialValue={p.status}><Select style={{width:220}} options={OPTIONS} /></Form.Item>
            <Button htmlType="submit" type="primary">Сохранить</Button>
          </Form>
        ]}>
          <List.Item.Meta title={`${p.trackingCode} — ${p.owner?.email}`} description={p.warehouse?.name || '—'} />
        </List.Item>
      )} />
    </Card>
  </div>
}
