'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowRight, ArrowLeft, BookOpen, Users, FileText,
  Search, Shield, Upload, CheckCircle, Star,
  Zap, Heart, Download, Share2, Sparkles,
  ChevronRight, X, Play, Pause, GraduationCap,
  Briefcase, Scale, Cpu, Building, Stethoscope
} from 'lucide-react'

type StepOption = {
  value: string
  label: string
  icon: React.ComponentType<any>
}

type Step = {
  title: string
  subtitle: string
  description: string
  icon: React.ComponentType<any>
  color: string
  features: string[]
  isSelection?: boolean
  options?: StepOption[]
  isForm?: boolean
  formType?: string
}

interface OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [userType, setUserType] = useState<'highschool' | 'university' | null>(null)
  const [selectedField, setSelectedField] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    grade: '',
    subjects: [] as string[],
    universityField: ''
  })

  const universityFields = [
    { id: 'law', name: 'ច្បាប់ (Law)', icon: Scale },
    { id: 'technology', name: 'បច្ចេកវិទ្យា (Technology)', icon: Cpu },
    { id: 'business', name: 'ពាណិជ្ជកម្ម (Business)', icon: Building },
    { id: 'medicine', name: 'វេជ្ជសាស្ត្រ (Medicine)', icon: Stethoscope },
    { id: 'other', name: 'ផ្សេងៗ (Other)', icon: Star }
  ]

  const highSchoolGrades = ['ថ្នាក់ទី១២', 'ថ្នាក់ទី១១', 'ថ្នាក់ទី១០', 'ថ្នាក់ទី៩']
  const highSchoolSubjects = [
    'ភាសាខ្មែរ', 'ភាសាអង់គ្លេស', 'គណិតវិទ្យា', 'រូបវិទ្យា',
    'គីមីវិទ្យា', 'ជីវវិទ្យា', 'ប្រវត្តិវិទ្យា', 'ភូមិវិទ្យា',
    'សីលធម៌', 'កីឡា', 'សិល្បៈ'
  ]

  const getSteps = (): Step[] => {
    const baseSteps: Step[] = [
      {
        title: 'សូមស្វាគមន៍មកកាន់ DocuLink',
        subtitle: 'វេទិកាចែករំលែកឯកសារសិក្សាដ៏ល្អបំផុតសម្រាប់និស្សិត',
        description: 'DocuLink ជាវេទិកាឌីជីថលដែលបង្កើតឡើងដោយនិស្សិតសម្រាប់និស្សិត ដើម្បីផ្តល់ជូនឱកាសចែករំលែកចំណេះដឹង និងធនធានសិក្សា។',
        icon: Sparkles,
        color: 'from-purple-500 via-pink-500 to-red-500',
        features: [
          'ចែករំលែកឯកសារសិក្សាដោយឥតគិតថ្លៃ',
          'សហគមន៍និស្សិតជាង 650 នាក់',
          'ឯកសារដែលត្រូវបានត្រួតពិនិត្យគុណភាព'
        ]
      }
    ]

    if (!userType) {
      baseSteps.push({
        title: 'អ្នកជានិស្សិតថ្នាក់ណា?',
        subtitle: 'ជ្រើសរើសកម្រិតសិក្សារបស់អ្នក',
        description: 'ដើម្បីផ្តល់ជូនឯកសារនិងធនធានដែលស័ក្តិសមសម្រាប់អ្នក សូមប្រាប់យើងថាអ្នកកំពុងសិក្សានៅថ្នាក់ណា។',
        icon: GraduationCap,
        color: 'from-blue-500 via-cyan-500 to-teal-500',
        features: [],
        isSelection: true,
        options: [
          { value: 'highschool', label: 'វិទ្យាល័យ (High School)', icon: BookOpen },
          { value: 'university', label: 'សាកលវិទ្យាល័យ (University)', icon: GraduationCap }
        ]
      })
    } else if (userType === 'highschool') {
      baseSteps.push({
        title: 'ព័ត៌មានសិក្សារបស់អ្នក',
        subtitle: 'ជួយយើងស្វែងរកឯកសារសិក្សាសម្រាប់អ្នក',
        description: 'បំពេញព័ត៌មានខាងក្រោមដើម្បីទទួលបានឯកសារនិងធនធានសិក្សាដែលស័ក្តិសម។',
        icon: BookOpen,
        color: 'from-green-500 via-emerald-500 to-teal-500',
        features: [],
        isForm: true,
        formType: 'highschool'
      })
    } else if (userType === 'university') {
      baseSteps.push({
        title: 'មុខវិជ្ជារបស់អ្នក',
        subtitle: 'អ្នកចាប់អារម្មណ៍លើមុខវិជ្ជាណា?',
        description: 'ជ្រើសរើសមុខវិជ្ជាដែលអ្នកកំពុងសិក្សា ដើម្បីយើងអាចណែនាំឯកសារនិងធនធានដែលពាក់ព័ន្ធ។',
        icon: Briefcase,
        color: 'from-orange-500 via-red-500 to-pink-500',
        features: [],
        isSelection: true,
        options: universityFields.map(field => ({
          value: field.id,
          label: field.name,
          icon: field.icon
        }))
      })
    }

    return baseSteps
  }

  const steps = getSteps()

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding and close modal
      localStorage.setItem('onboardingCompleted', 'true')
      localStorage.setItem('userType', userType || '')
      localStorage.setItem('selectedField', selectedField || '')
      localStorage.setItem('onboardingData', JSON.stringify(formData))
      onClose()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleUserTypeSelect = (type: 'highschool' | 'university') => {
    setUserType(type)
    setCurrentStep(1) // Move to next step
  }

  const handleFieldSelect = (field: string) => {
    setSelectedField(field)
    setFormData(prev => ({ ...prev, universityField: field }))
    // Complete onboarding after field selection
    localStorage.setItem('onboardingCompleted', 'true')
    localStorage.setItem('userType', userType || '')
    localStorage.setItem('selectedField', field)
    localStorage.setItem('onboardingData', JSON.stringify({ ...formData, universityField: field }))
    onClose()
  }

  const handleFormSubmit = () => {
    if (userType === 'highschool' && formData.grade && formData.subjects.length > 0) {
      // Complete onboarding
      localStorage.setItem('onboardingCompleted', 'true')
      localStorage.setItem('userType', userType)
      localStorage.setItem('onboardingData', JSON.stringify(formData))
      onClose()
    }
  }

  const handleSkip = () => {
    localStorage.setItem('onboardingCompleted', 'true')
    onClose()
  }

  const currentStepData = steps[currentStep]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">DocuLink</span>
          </div>
          <button
            onClick={handleSkip}
            className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
          >
            រំលង
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 max-h-[60vh] overflow-y-auto">
          {/* Icon */}
          <div className="w-20 h-20 rounded-2xl bg-indigo-600 flex items-center justify-center mb-6 mx-auto">
            <currentStepData.icon className="w-10 h-10 text-white" />
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-4 leading-tight">
            {currentStepData.title}
          </h1>

          {/* Subtitle */}
          <h2 className="text-lg md:text-xl font-semibold text-center text-indigo-600 mb-6">
            {currentStepData.subtitle}
          </h2>

          {/* Description */}
          <p className="text-center text-gray-600 max-w-2xl mb-8 leading-relaxed text-base mx-auto">
            {currentStepData.description}
          </p>

          {/* Features */}
          {currentStepData.features && currentStepData.features.length > 0 && (
            <div className="space-y-4 mb-8 w-full max-w-md mx-auto">
              {currentStepData.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-gray-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>
          )}

          {/* Selection Options */}
          {currentStepData.isSelection && currentStepData.options && (
            <div className="space-y-4 mb-8 w-full max-w-md mx-auto">
              {currentStepData.options.map((option, index) => (
                <button
                  key={option.value}
                  onClick={() => {
                    if (currentStep === 1 && !userType) {
                      handleUserTypeSelect(option.value as 'highschool' | 'university')
                    } else if (userType === 'university') {
                      handleFieldSelect(option.value)
                    }
                  }}
                  className="w-full flex items-center gap-4 bg-white p-6 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <option.icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <span className="text-gray-700 font-semibold text-left">{option.label}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
                </button>
              ))}
            </div>
          )}

          {/* High School Form */}
          {currentStepData.isForm && currentStepData.formType === 'highschool' && (
            <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-8 w-full max-w-md mx-auto">
              <div className="space-y-6">
                {/* Grade Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ថ្នាក់សិក្សារបស់អ្នក
                  </label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:outline-none transition-colors"
                  >
                    <option value="">ជ្រើសរើសថ្នាក់...</option>
                    {highSchoolGrades.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>

                {/* Subjects Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    មុខវិជ្ជាដែលអ្នកចាប់អារម្មណ៍ (ជ្រើសរើសបានច្រើន)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {highSchoolSubjects.map(subject => (
                      <label key={subject} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.subjects.includes(subject)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({ ...prev, subjects: [...prev.subjects, subject] }))
                            } else {
                              setFormData(prev => ({ ...prev, subjects: prev.subjects.filter(s => s !== subject) }))
                            }
                          }}
                          className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">{subject}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleFormSubmit}
                  disabled={!formData.grade || formData.subjects.length === 0}
                  className="w-full px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  បញ្ចប់ការរៀបចំ
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div className="border-t border-gray-200 p-6">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 text-gray-700"
            >
              <ArrowLeft className="w-5 h-5" />
              ថយក្រោយ
            </button>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {currentStep + 1} / {steps.length}
              </span>
            </div>

            <button
              onClick={handleNext}
              disabled={
                (currentStep === 1 && !userType) ||
                (currentStepData.isForm && currentStepData.formType === 'highschool' && (!formData.grade || formData.subjects.length === 0))
              }
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === steps.length - 1 ? 'ចាប់ផ្តើមប្រើ' : 'បន្ទាប់'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}