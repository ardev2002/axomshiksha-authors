"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle, X } from "lucide-react";
import * as motion from "motion/react-client";
import { Button } from "@/components/ui/button";
import { Kbd } from "../ui/kbd";
import { inter } from "@/utils/fonts";

const ValidationErrorCard = ({ errors }: { errors: string[] }) => {
  const [visible, setVisible] = useState(true);

  // 👇 Whenever new errors arrive, make sure card is visible again
  useEffect(() => {
    if (errors && errors.length > 0) {
      setVisible(true);
    }
  }, [JSON.stringify(errors)]); // Use JSON.stringify to properly compare arrays

  if (!errors || errors.length === 0 || !visible) return null;

  return (
    <motion.div
      key="validation-error"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className={inter.className}
    >
      <Card className="relative border border-amber-500/30 bg-amber-500/10 backdrop-blur-md text-amber-900 shadow-lg">
        {/* Dismiss Button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          title="Dismiss"
          onClick={() => setVisible(false)}
          className="absolute top-2 right-2 text-amber-600 hover:text-amber-800 hover:bg-transparent hover:cursor-pointer"
        >
          <X size={16} />
        </Button>

        <CardHeader className="flex items-center justify-between space-y-0 pb-2 pr-8">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-amber-500/15">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <CardTitle className="text-sm font-semibold tracking-wide text-foreground">
              Validation Errors
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="pb-4">
          <div className="space-y-2">
            {errors.map((err, index) => {
              // Split the error message into field name and error message
              const colonIndex = err.indexOf(':');
              const fieldName = colonIndex !== -1 ? err.substring(0, colonIndex) : err;
              const errorMessage = colonIndex !== -1 ? err.substring(colonIndex + 1).trim() : '';

              return (
                <div key={index} className="flex items-center gap-2 text-sm text-foreground/90">
                  <Kbd className="px-1.5 py-0.5 rounded leading-snug bg-background/50">
                    {fieldName}
                  </Kbd>
                  <span className="leading-snug">:</span>
                  <span className="leading-snug">
                    {errorMessage}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ValidationErrorCard;