"use client";
import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { GripVertical, MoveDown, MoveUp } from "lucide-react";

export const MotionCard = motion.create(Card);
export const MotionButton = motion.create(Button);
export const MotionInput = motion.create(Input);
export const MotionCardTitle = motion.create(CardTitle);
export const MotionCardHeader = motion.create(CardHeader);
export const MotionCardDescription = motion.create(CardDescription);
export const MotionCardContent = motion.create(CardContent);
export const MotionGripVertical = motion.create(GripVertical);
export const MotionMoveUp = motion.create(MoveUp);
export const MotionMoveDown = motion.create(MoveDown);
