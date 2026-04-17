import React from "react";
import { motion } from "framer-motion";

const FreelancersSection = () => {
  return (
    <section className="w-full py-16 md:py-24 bg-background transition-theme overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          
          {/* LEFT CONTAINER */}
          <div className="relative flex justify-center md:justify-start">
            
            {/* 1. Girl Image: Left se slide hokar aayegi */}
            <motion.img
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              src="./girl.png"
              alt="freelancer"
              className="w-[300px] md:w-[380px] object-contain"
            />

            {/* 2. Stat 1: Image aane ke 0.5s baad scale hoga */}
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.4, type: "spring", stiffness: 200 }}
              className="absolute top-10 left-40 lg:left-40 bg-card border border-border rounded-xl px-4 py-2 shadow-md"
            >
              <h3 className="text-primary font-bold text-lg">500+</h3>
              <p className="text-xs text-muted-foreground">freelancers</p>
            </motion.div>

            {/* 3. Stat 2: Image aane ke 0.7s baad scale hoga */}
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1, duration: 0.4, type: "spring", stiffness: 200 }}
              className="absolute top-28 lg:top-40 right-5 lg:right-40 bg-card border border-border rounded-xl px-4 py-2 shadow-md"
            >
              <h3 className="text-primary font-bold text-lg">300+</h3>
              <p className="text-xs text-muted-foreground">
                freelance work Posted
              </p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center md:text-left space-y-5"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
              Find The Best <br />
              <span className="text-primary">Freelancers</span> Here
            </h2>

            <p className="text-muted-foreground max-w-md mx-auto md:mx-0">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut erat
              bibendum ornare urna, cursus eget convallis. Feugiat imperdiet
              posuere justo, ultrices interdum sed orci nunc.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default FreelancersSection;