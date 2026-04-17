import { UserPlus, Search, CheckCircle } from "lucide-react";

const StepsSection = () => {
  const steps = [
    {
      icon: <UserPlus className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      bg: "bg-blue-100 dark:bg-blue-900/30",
      title: "Create Account",
      desc: "First you have to create a account here",
    },
    {
      icon: <Search className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
      bg: "bg-purple-100 dark:bg-purple-900/30",
      title: "Search Work",
      desc: "Search the best freelance work here",
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />,
      bg: "bg-green-100 dark:bg-green-900/30",
      title: "Save and Apply",
      desc: "Apply or save and start your work",
    },
  ];

  return (
    <section className="w-full -mt-8 md:-mt-[50px] relative z-20">
      <div className="max-w-6xl mx-auto px-4">
        
        <div className="bg-card border border-border rounded-2xl shadow-xl p-6 md:p-10 backdrop-blur">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            
            {steps.map((step, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-3 hover:scale-105 transition"
              >
                
                <div
                  className={`h-14 w-14 flex items-center justify-center rounded-full ${step.bg}`}
                >
                  {step.icon}
                </div>

                <h3 className="text-lg font-semibold text-foreground">
                  {step.title}
                </h3>

                <p className="text-sm text-muted-foreground max-w-[200px]">
                  {step.desc}
                </p>
              </div>
            ))}

          </div>
        </div>

      </div>
    </section>
  );
};

export default StepsSection;