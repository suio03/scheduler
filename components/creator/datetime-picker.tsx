// app/dashboard/create-post/DateTimePicker.tsx
"use client"

import { useState } from "react"
import { UseFormReturn } from "react-hook-form"
import { Calendar as CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface DateTimePickerProps {
    form: UseFormReturn<any>
}

// Helper to generate time options in 15-minute increments
const generateTimeOptions = () => {
    const options = []
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
            const hourStr = hour.toString().padStart(2, "0")
            const minuteStr = minute.toString().padStart(2, "0")
            const value = `${hourStr}:${minuteStr}`
            const label = `${hour % 12 || 12}:${minuteStr} ${hour >= 12 ? "PM" : "AM"}`
            options.push({ value, label })
        }
    }
    return options
}

const timeOptions = generateTimeOptions()

const DateTimePicker = ({ form }: DateTimePickerProps) => {
    const [postType, setPostType] = useState<"now" | "schedule">("now")
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
    const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined)

    const handlePostTypeChange = (value: "now" | "schedule") => {
        setPostType(value)

        if (value === "now") {
            form.setValue("scheduledFor", null)
        } else if (selectedDate && selectedTime) {
            updateScheduledDateTime(selectedDate, selectedTime)
        }
    }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = e.target.value ? new Date(e.target.value) : undefined
        setSelectedDate(date)
        if (date && selectedTime) {
            updateScheduledDateTime(date, selectedTime)
        }
    }

    const handleTimeChange = (time: string) => {
        setSelectedTime(time)
        if (selectedDate) {
            updateScheduledDateTime(selectedDate, time)
        }
    }

    const updateScheduledDateTime = (date: Date, timeStr: string) => {
        const [hours, minutes] = timeStr.split(":").map(Number)

        const scheduledDateTime = new Date(date)
        scheduledDateTime.setHours(hours)
        scheduledDateTime.setMinutes(minutes)
        scheduledDateTime.setSeconds(0)
        scheduledDateTime.setMilliseconds(0)

        form.setValue("scheduledFor", scheduledDateTime)
    }

    // Default to upcoming time slot
    const getDefaultTimeSlot = () => {
        const now = new Date()
        const hour = now.getHours()
        const minute = now.getMinutes()

        // Round up to the next 15 minute interval
        let roundedMinute = Math.ceil(minute / 15) * 15
        let roundedHour = hour

        if (roundedMinute >= 60) {
            roundedMinute = 0
            roundedHour = (hour + 1) % 24
        }

        return `${roundedHour.toString().padStart(2, "0")}:${roundedMinute.toString().padStart(2, "0")}`
    }

    // Get today's date in YYYY-MM-DD format for min attribute
    const today = new Date().toISOString().split('T')[0]

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Scheduling</h2>

            <RadioGroup
                defaultValue="now"
                value={postType}
                onValueChange={(value) => handlePostTypeChange(value as "now" | "schedule")}
                className="flex flex-col space-y-1"
            >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="now" id="now" />
                    <Label htmlFor="now">Post Now</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="schedule" id="schedule" />
                    <Label htmlFor="schedule">Schedule for Later</Label>
                </div>
            </RadioGroup>

            {postType === "schedule" && (
                <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                        <Label htmlFor="date-picker" className="block mb-2 text-sm">
                            Date
                        </Label>
                        <Input
                            id="date-picker"
                            type="date"
                            min={today}
                            onChange={handleDateChange}
                            className="w-full"
                        />
                    </div>

                    <div>
                        <Label htmlFor="time-picker" className="block mb-2 text-sm">
                            Time
                        </Label>
                        <Select
                            onValueChange={handleTimeChange}
                            defaultValue={getDefaultTimeSlot()}
                        >
                            <SelectTrigger id="time-picker" className="w-full">
                                <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent>
                                {timeOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}

            {postType === "schedule" && selectedDate && selectedTime && (
                <div className="mt-4 p-3 bg-primary/5 border rounded-md">
                    <p className="text-sm font-medium">
                        Your post will be scheduled for:
                    </p>
                    <p className="text-md">
                        {selectedDate && selectedDate.toLocaleDateString(undefined, {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })} at{" "}
                        {selectedTime && timeOptions.find(t => t.value === selectedTime)?.label}
                    </p>
                </div>
            )}
        </div>
    )
}

export default DateTimePicker