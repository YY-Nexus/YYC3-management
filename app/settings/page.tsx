"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, AlertCircle, CheckCircle, Lock, Bell, Globe, Shield, Database } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function Settings() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("ai")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // AI设置
  const [apiKey, setApiKey] = useState("")
  const [model, setModel] = useState("gpt-3.5-turbo")
  const [useExternalModel, setUseExternalModel] = useState(false)
  const [externalModelUrl, setExternalModelUrl] = useState("")

  // 通知设置
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [desktopNotifications, setDesktopNotifications] = useState(true)
  const [notificationSound, setNotificationSound] = useState(true)

  // 安全设置
  const [twoFactorAuth, setTwoFactorAuth] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState("30")
  const [passwordExpiry, setPasswordExpiry] = useState("90")
  const [loginAttempts, setLoginAttempts] = useState("5")

  // 系统设置
  const [language, setLanguage] = useState("zh-CN")
  const [theme, setTheme] = useState("light")
  const [timezone, setTimezone] = useState("Asia/Shanghai")
  const [dateFormat, setDateFormat] = useState("YYYY-MM-DD")

  // 数据备份设置
  const [autoBackup, setAutoBackup] = useState(true)
  const [backupFrequency, setBackupFrequency] = useState("daily")
  const [backupRetention, setBackupRetention] = useState("30")
  const [backupLocation, setBackupLocation] = useState("cloud")

  // 模拟加载设置
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true)
      try {
        // 模拟从API加载设置
        await new Promise((resolve) => setTimeout(resolve, 800))
        // 实际应用中，这里应该从API获取设置

        // 模拟成功加载
        setIsLoading(false)
      } catch (err) {
        setError("加载设置失败，请稍后重试")
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [])

  const handleSave = async () => {
    setIsLoading(true)
    setError(null)
    setIsSaved(false)

    try {
      // 验证设置
      if (useExternalModel && !externalModelUrl) {
        throw new Error("使用外部模型时必须提供API地址")
      }

      // 模拟保存到API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 保存成功
      setIsSaved(true)
      toast({
        title: "设置已保存",
        description: "您的系统设置已成功更新",
      })

      // 3秒后重置保存状态
      setTimeout(() => setIsSaved(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存设置失败，请稍后重试")
    } finally {
      setIsLoading(false)
    }
  }

  const handleTest = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // 验证API密钥
      if (!apiKey) {
        throw new Error("请输入API密钥")
      }

      if (useExternalModel && !externalModelUrl) {
        throw new Error("使用外部模型时必须提供API地址")
      }

      // 模拟API测试
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // 测试成功
      toast({
        title: "API连接测试成功",
        description: "您的API密钥和设置有效",
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "API连接测试失败，请检查您的设置")
    } finally {
      setIsLoading(false)
    }
  }

  const resetSettings = () => {
    // 重置为默认设置
    setApiKey("")
    setModel("gpt-3.5-turbo")
    setUseExternalModel(false)
    setExternalModelUrl("")

    setEmailNotifications(true)
    setSmsNotifications(false)
    setDesktopNotifications(true)
    setNotificationSound(true)

    setTwoFactorAuth(false)
    setSessionTimeout("30")
    setPasswordExpiry("90")
    setLoginAttempts("5")

    setLanguage("zh-CN")
    setTheme("light")
    setTimezone("Asia/Shanghai")
    setDateFormat("YYYY-MM-DD")

    setAutoBackup(true)
    setBackupFrequency("daily")
    setBackupRetention("30")
    setBackupLocation("cloud")

    toast({
      title: "设置已重置",
      description: "所有设置已恢复为默认值",
    })
  }

  return (
    <div className="p-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">系统设置</h1>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>错误</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isSaved && (
        <Alert className="mb-4 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle>保存成功</AlertTitle>
          <AlertDescription>您的设置已成功保存</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="ai" className="flex items-center gap-1">
            <Database className="h-4 w-4" />
            <span>AI设置</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-1">
            <Bell className="h-4 w-4" />
            <span>通知设置</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            <span>安全设置</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-1">
            <Globe className="h-4 w-4" />
            <span>系统设置</span>
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-1">
            <Database className="h-4 w-4" />
            <span>数据备份</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle>AI模型设置</CardTitle>
              <CardDescription>配置AI助手使用的模型和API</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="use-external-model" className="flex items-center justify-between">
                  <span>使用外部AI模型</span>
                  <Switch
                    id="use-external-model"
                    checked={useExternalModel}
                    onCheckedChange={setUseExternalModel}
                    disabled={isLoading}
                  />
                </Label>
                <p className="text-sm text-gray-500">启用此选项可使用外部AI模型API而非默认模型</p>
              </div>

              {useExternalModel && (
                <div className="space-y-2">
                  <Label htmlFor="external-model-url">外部模型URL</Label>
                  <Input
                    id="external-model-url"
                    value={externalModelUrl}
                    onChange={(e) => setExternalModelUrl(e.target.value)}
                    placeholder="输入外部模型的API地址"
                    disabled={isLoading}
                  />
                  <p className="text-sm text-gray-500">请确保外部API支持与本系统相同的请求格式</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="api-key">API密钥</Label>
                <div className="relative">
                  <Input
                    id="api-key"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="输入您的API密钥"
                    disabled={isLoading}
                  />
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                </div>
                <p className="text-sm text-gray-500">API密钥用于访问AI服务，请妥善保管</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">选择模型</Label>
                <Select value={model} onValueChange={setModel} disabled={isLoading || useExternalModel}>
                  <SelectTrigger id="model">
                    <SelectValue placeholder="选择AI模型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="claude-v1">Claude v1</SelectItem>
                    <SelectItem value="claude-instant-v1">Claude Instant v1</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">选择适合您需求的AI模型，不同模型有不同的能力和定价</p>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleTest} className="btn-3d" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  测试API连接
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>通知设置</CardTitle>
              <CardDescription>配置系统通知的接收方式和频率</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-notifications" className="flex items-center justify-between">
                  <span>电子邮件通知</span>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                    disabled={isLoading}
                  />
                </Label>
                <p className="text-sm text-gray-500">接收重要系统通知和提醒的电子邮件</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sms-notifications" className="flex items-center justify-between">
                  <span>短信通知</span>
                  <Switch
                    id="sms-notifications"
                    checked={smsNotifications}
                    onCheckedChange={setSmsNotifications}
                    disabled={isLoading}
                  />
                </Label>
                <p className="text-sm text-gray-500">接收紧急通知的短信提醒（可能产生额外费用）</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="desktop-notifications" className="flex items-center justify-between">
                  <span>桌面通知</span>
                  <Switch
                    id="desktop-notifications"
                    checked={desktopNotifications}
                    onCheckedChange={setDesktopNotifications}
                    disabled={isLoading}
                  />
                </Label>
                <p className="text-sm text-gray-500">在浏览器中显示桌面通知</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notification-sound" className="flex items-center justify-between">
                  <span>通知声音</span>
                  <Switch
                    id="notification-sound"
                    checked={notificationSound}
                    onCheckedChange={setNotificationSound}
                    disabled={isLoading}
                  />
                </Label>
                <p className="text-sm text-gray-500">收到通知时播放声音提示</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>安全设置</CardTitle>
              <CardDescription>配置系统的安全选项和访问控制</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="two-factor-auth" className="flex items-center justify-between">
                  <span>两步验证</span>
                  <Switch
                    id="two-factor-auth"
                    checked={twoFactorAuth}
                    onCheckedChange={setTwoFactorAuth}
                    disabled={isLoading}
                  />
                </Label>
                <p className="text-sm text-gray-500">启用两步验证以提高账户安全性</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="session-timeout">会话超时（分钟）</Label>
                <Input
                  id="session-timeout"
                  type="number"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  min="5"
                  max="120"
                  disabled={isLoading}
                />
                <p className="text-sm text-gray-500">设置用户无操作后自动登出的时间</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password-expiry">密码过期时间（天）</Label>
                <Input
                  id="password-expiry"
                  type="number"
                  value={passwordExpiry}
                  onChange={(e) => setPasswordExpiry(e.target.value)}
                  min="30"
                  max="365"
                  disabled={isLoading}
                />
                <p className="text-sm text-gray-500">设置密码需要更新的周期</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-attempts">最大登录尝试次数</Label>
                <Input
                  id="login-attempts"
                  type="number"
                  value={loginAttempts}
                  onChange={(e) => setLoginAttempts(e.target.value)}
                  min="3"
                  max="10"
                  disabled={isLoading}
                />
                <p className="text-sm text-gray-500">设置登录失败后账户锁定的尝试次数</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>系统设置</CardTitle>
              <CardDescription>配置系统的基本设置和显示选项</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">系统语言</Label>
                <Select value={language} onValueChange={setLanguage} disabled={isLoading}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="选择语言" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zh-CN">简体中文</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="ja-JP">日本語</SelectItem>
                    <SelectItem value="ko-KR">한국어</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">设置系统界面显示的语言</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme">界面主题</Label>
                <Select value={theme} onValueChange={setTheme} disabled={isLoading}>
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="选择主题" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">浅色</SelectItem>
                    <SelectItem value="dark">深色</SelectItem>
                    <SelectItem value="system">跟随系统</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">设置系统界面的显示主题</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">时区</Label>
                <Select value={timezone} onValueChange={setTimezone} disabled={isLoading}>
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="选择时区" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Shanghai">中国标准时间 (UTC+8)</SelectItem>
                    <SelectItem value="America/New_York">美国东部时间 (UTC-5)</SelectItem>
                    <SelectItem value="Europe/London">格林威治标准时间 (UTC+0)</SelectItem>
                    <SelectItem value="Asia/Tokyo">日本标准时间 (UTC+9)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">设置系统使用的时区</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-format">日期格式</Label>
                <Select value={dateFormat} onValueChange={setDateFormat} disabled={isLoading}>
                  <SelectTrigger id="date-format">
                    <SelectValue placeholder="选择日期格式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="YYYY年MM月DD日">YYYY年MM月DD日</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">设置系统显示的日期格式</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle>数据备份设置</CardTitle>
              <CardDescription>配置系统数据的备份策略</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="auto-backup" className="flex items-center justify-between">
                  <span>自动备份</span>
                  <Switch id="auto-backup" checked={autoBackup} onCheckedChange={setAutoBackup} disabled={isLoading} />
                </Label>
                <p className="text-sm text-gray-500">启用系统数据的自动备份</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backup-frequency">备份频率</Label>
                <Select value={backupFrequency} onValueChange={setBackupFrequency} disabled={isLoading || !autoBackup}>
                  <SelectTrigger id="backup-frequency">
                    <SelectValue placeholder="选择备份频率" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">每小时</SelectItem>
                    <SelectItem value="daily">每天</SelectItem>
                    <SelectItem value="weekly">每周</SelectItem>
                    <SelectItem value="monthly">每月</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">设置自动备份的执行频率</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backup-retention">备份保留天数</Label>
                <Input
                  id="backup-retention"
                  type="number"
                  value={backupRetention}
                  onChange={(e) => setBackupRetention(e.target.value)}
                  min="7"
                  max="365"
                  disabled={isLoading || !autoBackup}
                />
                <p className="text-sm text-gray-500">设置备份数据的保留时间</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backup-location">备份位置</Label>
                <Select value={backupLocation} onValueChange={setBackupLocation} disabled={isLoading || !autoBackup}>
                  <SelectTrigger id="backup-location">
                    <SelectValue placeholder="选择备份位置" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">本地存储</SelectItem>
                    <SelectItem value="cloud">云存储</SelectItem>
                    <SelectItem value="both">本地和云存储</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">设置备份数据的存储位置</p>
              </div>

              <div className="pt-2">
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => {
                    toast({
                      title: "手动备份已启动",
                      description: "系统正在执行手动备份，请稍候...",
                    })
                    // 这里应该调用实际的备份API
                    setTimeout(() => {
                      toast({
                        title: "备份完成",
                        description: "系统数据已成功备份",
                      })
                    }, 2000)
                  }}
                  disabled={isLoading}
                >
                  立即备份
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "备份恢复",
                      description: "请从备份管理页面选择要恢复的备份",
                    })
                  }}
                  disabled={isLoading}
                >
                  恢复备份
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-between">
        <Button variant="outline" onClick={resetSettings} disabled={isLoading}>
          重置为默认设置
        </Button>
        <Button onClick={handleSave} className="btn-3d" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isLoading ? "保存中..." : "保存设置"}
        </Button>
      </div>
    </div>
  )
}
