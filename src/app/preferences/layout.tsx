import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cx } from "class-variance-authority";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

const Box = ({
  title,
  subTitle,
  icon,
  children,
  className,
  color,
  cardClassName,
}: {
  children: ReactNode;
  title: string;
  subTitle: string;
  icon: ReactNode;
  className?: string;
  color: string;
  cardClassName?: string;
}) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.1 }}
    >
      <Card
        className={cx(
          "shadow-lg hover:shadow-xl transition-shadow duration-300 !p-0",
          cardClassName
        )}
      >
        <CardHeader className={`bg-gradient-to-r ${color} py-4`}>
          <div className="flex items-center space-x-3">
            {icon}
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{subTitle}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className={cx("p-6", className)}>{children}</CardContent>
      </Card>
    </motion.div>
  );
};

export default Box;