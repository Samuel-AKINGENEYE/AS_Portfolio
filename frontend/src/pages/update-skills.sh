#!/bin/bash
cd /home/samuel/Projects/AS_Portfolio/frontend/src/pages

# Backup current Home.jsx
cp Home.jsx Home.jsx.backup.skills

# Use Python to replace the skills section
python3 << 'EOF'
import re

with open('Home.jsx', 'r') as f:
    content = f.read()

# Find and replace the skills section
old_skills = r'(<section id="skills" className="py-24 px-6 bg-slate-50 dark:bg-slate-800/20">.*?</section>)'

new_skills = '''<section id="skills" className="py-24 px-6 bg-slate-50 dark:bg-slate-800/20">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="Skills" subtitle="Technologies and tools I work with" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Frontend */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
                🎨 Frontend
              </h3>
              <ul className="space-y-2">
                <li className="text-slate-600 dark:text-slate-400 text-sm flex items-center gap-2"><span className="text-base">⚛️</span> React</li>
                <li className="text-slate-600 dark:text-slate-400 text-sm flex items-center gap-2"><span className="text-base">▲</span> Next.js</li>
                <li className="text-slate-600 dark:text-slate-400 text-sm flex items-center gap-2"><span className="text-base">📘</span> TypeScript</li>
                <li className="text-slate-600 dark:text-slate-400 text-sm flex items-center gap-2"><span className="text-base">🎨</span> Tailwind CSS</li>
                <li className="text-slate-600 dark:text-slate-400 text-sm flex items-center gap-2"><span className="text-base">🌐</span> HTML/CSS</li>
                <li className="text-slate-600 dark:text-slate-400 text-sm flex items-center gap-2"><span className="text-base">📜</span> JavaScript</li>
                <li className="text-slate-600 dark:text-slate-400 text-sm flex items-center gap-2"><span className="text-base">🎨</span> Figma</li>
              </ul>
            </div>

            {/* Backend */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
                ⚙️ Backend
              </h3>
              <ul className="space-y-2">
                <li className="text-slate-600 dark:text-slate-400 text-sm flex items-center gap-2"><span className="text-base">🚀</span> Node.js</li>
                <li className="text-slate-600 dark:text-slate-400 text-sm flex items-center gap-2"><span className="text-base">⚡</span> Express</li>
                <li className="text-slate-600 dark:text-slate-400 text-sm flex items-center gap-2"><span className="text-base">🐍</span> Python</li>
                <li className="text-slate-600 dark:text-slate-400 text-sm flex items-center gap-2"><span className="text-base">☕</span> Java</li>
                <li className="text-slate-600 dark:text-slate-400 text-sm flex items-center gap-2"><span className="text-base">🐘</span> PHP</li>
              </ul>
            </div>

            {/* Database */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
                🗄️ Database
              </h3>
              <ul className="space-y-2">
                <li className="text-slate-600 dark:text-slate-400 text-sm flex items-center gap-2"><span className="text-base">🐘</span> PostgreSQL</li>
                <li className="text-slate-600 dark:text-slate-400 text-sm flex items-center gap-2"><span className="text-base">🍃</span> MongoDB</li>
                <li className="text-slate-600 dark:text-slate-400 text-sm flex items-center gap-2"><span className="text-base">⚡</span> Redis</li>
                <li className="text-slate-600 dark:text-slate-400 text-sm flex items-center gap-2"><span className="text-base">🐬</span> MySQL</li>
              </ul>
            </div>

            {/* Tools */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
                🛠️ Tools
              </h3>
              <ul className="space-y-2">
                <li className="text-slate-600 dark:text-slate-400 text-sm flex items-center gap-2"><span className="text-base">🔀</span> Git</li>
                <li className="text-slate-600 dark:text-slate-400 text-sm flex items-center gap-2"><span className="text-base">🐳</span> Docker</li>
                <li className="text-slate-600 dark:text-slate-400 text-sm flex items-center gap-2"><span className="text-base">☁️</span> AWS</li>
                <li className="text-slate-600 dark:text-slate-400 text-sm flex items-center gap-2"><span className="text-base">▲</span> Vercel</li>
              </ul>
            </div>
          </div>
        </div>
      </section>'''

# Replace the skills section
content = re.sub(old_skills, new_skills, content, flags=re.DOTALL)

with open('Home.jsx', 'w') as f:
    f.write(content)

print("Skills section updated successfully!")
EOF

