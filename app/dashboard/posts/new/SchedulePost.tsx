import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

interface SchedulePostProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSchedule: (scheduledDate: Date) => void;
  initialDate?: Date;
}

export default function SchedulePost({
  open,
  onOpenChange,
  onSchedule,
  initialDate,
}: SchedulePostProps) {
  const [date, setDate] = useState<Date | undefined>(initialDate || new Date());
  const [selectedHour, setSelectedHour] = useState<string>("12");
  const [selectedMinute, setSelectedMinute] = useState<string>("00");
  const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM">("AM");

  // Initialize time values
  useEffect(() => {
    if (initialDate) {
      setDate(initialDate);
      
      // Set time values
      let hours = initialDate.getHours();
      const minutes = initialDate.getMinutes().toString().padStart(2, '0');
      const period = hours >= 12 ? 'PM' : 'AM';
      
      if (hours === 0) {
        hours = 12;
      } else if (hours > 12) {
        hours -= 12;
      }
      
      setSelectedHour(hours.toString());
      setSelectedMinute(minutes);
      setSelectedPeriod(period);
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDate(tomorrow);
      setSelectedHour("9");
      setSelectedMinute("00");
      setSelectedPeriod("AM");
    }
  }, [initialDate, open]);

  // Generate time options
  const hours = Array.from({ length: 12 }, (_, i) => (i === 0 ? 12 : i));
  const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

  const handleSchedule = () => {
    if (!date) return;
    
    // Create date object from selected values
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    
    let hour = parseInt(selectedHour);
    
    // Convert to 24-hour format
    if (selectedPeriod === 'PM' && hour !== 12) {
      hour += 12;
    } else if (selectedPeriod === 'AM' && hour === 12) {
      hour = 0;
    }
    
    const minute = parseInt(selectedMinute);
    
    const scheduledDate = new Date(year, month, day, hour, minute);
    onSchedule(scheduledDate);
  };

  // Function to disable today and previous dates
  const disablePastDates = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    return selectedDate <= today;
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-violet-500" />
            Schedule Post
          </AlertDialogTitle>
          <AlertDialogDescription>
            Choose when you'd like this post to be published automatically.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-4 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Date & Time</label>
            <div className="flex flex-wrap gap-4 justify-between">
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-full hover:cursor-pointer justify-start text-left font-normal border-white/20 bg-background/60 hover:bg-background/80 ${
                        !date && "text-muted-foreground"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 hover:cursor-pointer" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-background/95 border border-white/10">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={disablePastDates}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="flex items-center gap-2">
                <div>
                  <Select value={selectedHour} onValueChange={setSelectedHour}>
                    <SelectTrigger className="w-18 hover:cursor-pointer border-white/20 bg-background/60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background/95 border border-white/10">
                      {hours.map((hour) => (
                        <SelectItem key={hour} value={hour.toString()}>
                          {hour}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <span className="text-muted-foreground">:</span>
                
                <div>
                  <Select value={selectedMinute} onValueChange={setSelectedMinute}>
                    <SelectTrigger className="w-18 hover:cursor-pointer border-white/20 bg-background/60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background/95 border border-white/10">
                      {minutes.map((minute) => (
                        <SelectItem key={minute} value={minute}>
                          {minute}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Select value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as "AM" | "PM")}>
                    <SelectTrigger className="w-18 hover:cursor-pointer border-white/20 bg-background/60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background/95 border border-white/10">
                      <SelectItem value="AM">AM</SelectItem>
                      <SelectItem value="PM">PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <AlertDialogFooter className="self-center">
          <AlertDialogCancel className="hover:cursor-pointer">Cancel</AlertDialogCancel>
          <AlertDialogAction 
            className="bg-violet-600 hover:bg-violet-700 text-white hover:cursor-pointer"
            onClick={handleSchedule}
          >
            Schedule
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}