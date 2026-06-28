"use client";

import { useState, type MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PlaceCardProps {
  images: string[];
  tags: string[];
  rating: number;
  title: string;
  dateRange: string;
  hostType: string;
  isTopRated?: boolean;
  description: string;
  priceFrom: number;
  priceSuffix?: string;
  href?: string;
  className?: string;
}

export const PlaceCard = ({
  images,
  tags,
  rating,
  title,
  dateRange,
  hostType,
  isTopRated = false,
  description,
  priceFrom,
  priceSuffix,
  href,
  className,
}: PlaceCardProps) => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const changeImage = (event: MouseEvent, newDirection: number) => {
    event.preventDefault();
    event.stopPropagation();
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) return images.length - 1;
      if (nextIndex >= images.length) return 0;
      return nextIndex;
    });
  };

  const goToImage = (event: MouseEvent, index: number) => {
    event.preventDefault();
    event.stopPropagation();
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const carouselVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      variants={contentVariants}
      whileHover={{
        y: -4,
        boxShadow: "0px 30px 60px -32px rgba(92,70,39,0.55)",
        transition: { type: "spring", stiffness: 300, damping: 24 },
      }}
      onClick={() => {
        if (href) router.push(href);
      }}
      className={cn(
        "group w-full overflow-hidden rounded-2xl border border-white/60 bg-white/80 text-card-foreground shadow-[0_22px_50px_-32px_rgba(92,70,39,0.45)] backdrop-blur",
        href && "cursor-pointer",
        className,
      )}
    >
      <div className="relative h-64 overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={title}
            custom={direction}
            variants={carouselVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute h-full w-full object-cover"
          />
        </AnimatePresence>

        {images.length > 1 ? (
          <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-black/30 text-white hover:bg-black/50"
              onClick={(e: MouseEvent) => changeImage(e, -1)}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-black/30 text-white hover:bg-black/50"
              onClick={(e: MouseEvent) => changeImage(e, 1)}
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        ) : null}

        <div className="absolute left-3 top-3 flex gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-background/70 backdrop-blur"
            >
              {tag}
            </Badge>
          ))}
        </div>
        <div className="absolute right-3 top-3">
          <Badge
            variant="secondary"
            className="flex items-center gap-1 bg-background/70 backdrop-blur"
          >
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            {rating}
          </Badge>
        </div>

        {images.length > 1 ? (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={(e) => goToImage(e, index)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  currentIndex === index ? "w-4 bg-white" : "w-1.5 bg-white/50",
                )}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        ) : null}
      </div>

      <motion.div variants={contentVariants} className="space-y-3 p-5">
        <motion.div
          variants={itemVariants}
          className="flex items-start justify-between gap-3"
        >
          <h3 className="text-xl font-semibold leading-tight">{title}</h3>
          {isTopRated ? (
            <Badge variant="outline" className="shrink-0">
              Top rated
            </Badge>
          ) : null}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="text-sm text-muted-foreground"
        >
          <span>{dateRange}</span> &bull; <span>{hostType}</span>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="text-sm leading-relaxed text-muted-foreground line-clamp-2"
        >
          {description}
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between pt-2"
        >
          <p className="font-semibold">
            <span className="text-sm font-normal text-muted-foreground">
              From{" "}
            </span>
            ${priceFrom.toLocaleString()}
            {priceSuffix ? (
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                {priceSuffix}
              </span>
            ) : null}
          </p>
          {href ? (
            <Button
              render={<Link href={href} />}
              className="rounded-full"
              onClick={(e: MouseEvent) => e.stopPropagation()}
            >
              View details
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          ) : (
            <Button className="rounded-full">
              Book now
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
