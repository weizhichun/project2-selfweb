"use client";

import { ReactNode, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

type ConfirmProps = {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive" | "success";
  icon?: ReactNode;
};

type ConfirmDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
} & ConfirmProps;

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "确认",
  cancelText = "取消",
  variant = "default",
  icon,
  isLoading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    if (icon) return icon;
    
    switch (variant) {
      case "destructive":
        return <XCircle className="h-6 w-6 text-red-600" />;
      case "success":
        return <CheckCircle2 className="h-6 w-6 text-green-600" />;
      default:
        return <AlertCircle className="h-6 w-6 text-blue-600" />;
    }
  };

  const getConfirmButtonVariant = () => {
    switch (variant) {
      case "destructive":
        return "destructive" as const;
      case "success":
        return "default" as const;
      default:
        return "default" as const;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 animate-in fade-in zoom-in duration-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getIcon()}
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={getConfirmButtonVariant()}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                处理中...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

// Hook for easy confirmation dialog usage
export function useConfirm() {
  const [dialogState, setDialogState] = useState<ConfirmProps & {
    isOpen: boolean;
    onConfirm: () => void;
    isLoading?: boolean;
  } | null>(null);

  const confirm = useCallback((props: ConfirmProps): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialogState({
        ...props,
        isOpen: true,
        isLoading: false,
        onConfirm: () => {
          resolve(true);
          setDialogState(null);
        },
      });
    });
  }, []);

  const ConfirmDialogWrapper = () => {
    if (!dialogState) return null;
    return (
      <ConfirmDialog
        {...dialogState}
        onClose={() => {
          setDialogState(null);
        }}
      />
    );
  };

  return {
    confirm,
    ConfirmDialog: ConfirmDialogWrapper,
  };
}
