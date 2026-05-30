"use client";

import { ProtectedPage } from "@/components/auth/ProtectedPage";
import { PasswordSettings } from "@/components/auth/PasswordSettings";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User, Lock, RotateCcw, GraduationCap } from "lucide-react";

export default function SettingsPage() {
  return (
    <ProtectedPage>
      <div className="container py-10">
        <h1 className="text-2xl font-bold mb-7">设置</h1>
        
        <div className="grid gap-5 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                个人信息
              </CardTitle>
              <CardDescription>
                编辑您的个人基本信息，如姓名、联系方式、头像等
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-muted-foreground">
                    管理您的个人资料信息
                  </p>
                </div>
                <Link href="/settings/profile">
                  <Button variant="default" size="sm">
                    编辑个人信息
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                经历管理
              </CardTitle>
              <CardDescription>
                管理您的教育经历和实习经历
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-muted-foreground">
                    添加、编辑、删除和排序您的经历
                  </p>
                </div>
                <Link href="/settings/experience">
                  <Button variant="default" size="sm">
                    管理经历
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                密码设置
              </CardTitle>
              <CardDescription>
                修改您的本地登录密码
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PasswordSettings />
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedPage>
  );
}
