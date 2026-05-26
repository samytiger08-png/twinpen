import { PenTool, Tablet, Heart, Eye, Smartphone, Check, HelpCircle } from "lucide-react";
import { motion } from "motion/react";

export default function Features() {
  return (
    <section id="features" className="border-t border-white/5 bg-[#08080a] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title / Section Heading */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            أداة واحدة للكتابة على الورق والشاشة 🖋️📲
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-400">
            تم تصميم <span className="text-white font-bold">N1 TWINPEN</span> بمثالية تامة لتسهيل حياة الطلاب، المهندسين، ورجال الأعمال في الجزائر. اختبر السلاسة المطلقة في كل تدوين.
          </p>
        </div>

        {/* Dual Side Feature Breakdown Layout */}
        <div id="dual-use" className="grid grid-cols-1 gap-8 md:grid-cols-2">
          
          {/* Side A: Paper Ballpoint Pen */}
          <div className="relative group overflow-hidden rounded-3xl glass-panel p-6 transition-all hover:scale-[1.01] duration-300">
            <div className="absolute top-0 right-0 -z-10 h-32 w-32 bg-blue-500/5 rounded-full blur-2xl" />
            
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-white/10 mb-5">
              <PenTool className="h-5.5 w-5.5" />
            </div>

            <h3 className="text-lg font-bold text-white mb-2">
              الجهة الأولى: قلم حبر جاف فاخر (للكتابة على الورق)
            </h3>
            
            <p className="text-gray-300 text-xs leading-relaxed mb-4 font-light">
              رأس قلم حبر دقيق وممتاز للكتابة السريعة تدوين الملاحظات، وتوقيع الوثائق دون تقطع أو تلطيخ.
            </p>

            <ul className="space-y-2 text-xs text-gray-350">
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                <span>تدفق حبر جاف انسيابي يمنع تعب اليد</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                <span>غطاء محكم لحماية رأس القلم من الجفاف</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                <span>هيكل معدني مريح ومضاد للانزلاق</span>
              </li>
            </ul>
          </div>

          {/* Side B: Precise Screen Stylus */}
          <div className="relative group overflow-hidden rounded-3xl glass-panel p-6 transition-all hover:scale-[1.01] duration-300">
            <div className="absolute top-0 right-0 -z-10 h-32 w-32 bg-indigo-500/5 rounded-full blur-2xl" />
            
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-white/10 mb-5">
              <Tablet className="h-5.5 w-5.5" />
            </div>

            <h3 className="text-lg font-bold text-white mb-2">
              الجهة الثانية: رأس لمسي ذكي (للشاشات اللمسية)
            </h3>
            
            <p className="text-gray-300 text-xs leading-relaxed mb-4 font-light">
              رأس مطاطي ناعم يحاكي حركة الإصبع بدقة متناهية دون ترك أي خدوش أو بصمات مزعجة على شاشتك.
            </p>

            <ul className="space-y-2 text-xs text-gray-355">
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                <span>يعمل بدون شحن أو بطارية وبدون بلوتوث (جاهز دائماً)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                <span>حماية كاملة من الخدوش والبصمات المزعجة</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                <span>دعم كامل لجميع الهواتف، التابلت والشاشات اللمسية</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Compatibility Grid List */}
        <div className="mt-16 rounded-3xl glass-panel p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="space-y-2 text-right">
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-blue-400" />
                التوافقية المطلقة مع الأجهزة اللوحية والمحمولة
              </h4>
              <p className="text-sm text-gray-400">
                يعمل القلم بسلاسة مع كافة الأجهزة ذات شاشات اللمس Capacitive اللمسية دون الحاجة لأي برمجة:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-center">
            <div className="rounded-2xl glass-card p-4">
              <span className="text-sm font-bold text-white block">Apple iPad & iPhone</span>
              <span className="text-xs text-indigo-400 mt-1 block">آيباد وآيفون بكافة أجيالها</span>
            </div>
            <div className="rounded-2xl glass-card p-4">
              <span className="text-sm font-bold text-white block">Samsung Galaxy</span>
              <span className="text-xs text-indigo-400 mt-1 block">تابلت وموبايل سامسونج ونوت</span>
            </div>
            <div className="rounded-2xl glass-card p-4">
              <span className="text-sm font-bold text-white block">Android Tablets</span>
              <span className="text-xs text-indigo-400 mt-1 block">جميع أجهزة ريدمي، أوبو، لينوفو</span>
            </div>
            <div className="rounded-2xl glass-card p-4">
              <span className="text-sm font-bold text-white block">Tactile Laptops</span>
              <span className="text-xs text-indigo-400 mt-1 block">الحواسيب المحمولة ذات الشاشات اللمسية</span>
            </div>
          </div>
        </div>



      </div>
    </section>
  );
}
