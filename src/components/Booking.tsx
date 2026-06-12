import { useState, useEffect, FormEvent } from "react";
import { 
  ArrowLeft, ArrowRight, Calendar, Clock, User, 
  CheckCircle, CreditCard, Stethoscope, Sparkles, AlertCircle 
} from "lucide-react";
import { DOCTORS, SPECIALTIES, Doctor } from "../data/doctors";

// Basic interface for saved appointment
export interface ScheduledAppointment {
  id: string;
  doctorName: string;
  doctorId: string;
  doctorRole: string;
  doctorImage: string;
  specialtyName: string;
  dateStr: string; // "Terça, 16 de Junho"
  timeSlot: string; // "14:00"
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  paymentType: string;
  status: "active" | "completed" | "canceled";
  code: string; // random booking code e.g. "SRC-1049"
}

interface BookingProps {
  preselectedDoctorId: string | null;
  setPreselectedDoctorId: (id: string | null) => void;
  onAppointmentCreated: (appointment: ScheduledAppointment) => void;
  setView: (view: string) => void;
}

export default function Booking({ 
  preselectedDoctorId, 
  setPreselectedDoctorId, 
  onAppointmentCreated, 
  setView 
}: BookingProps) {
  
  // Stepper state: 1 (Doctor), 2 (Date & Time), 3 (Patient Info), 4 (Review/Success)
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  
  // Patient details state
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientCpf, setPatientCpf] = useState("");
  const [paymentType, setPaymentType] = useState("Particular");
  const [formError, setFormError] = useState("");

  const [bookingConfirmed, setBookingConfirmed] = useState<ScheduledAppointment | null>(null);

  // Set initial selected doctor if preselectedDoctorId prop is provided
  useEffect(() => {
    if (preselectedDoctorId) {
      const doc = DOCTORS.find(d => d.id === preselectedDoctorId);
      if (doc) {
        setSelectedDoctor(doc);
        setStep(2); // Jump to date choice directly
      }
    }
  }, [preselectedDoctorId]);

  // Generate standard upcoming 7 dates for scheduling, checking weekdays
  const getUpcomingDates = () => {
    const dates = [];
    const locale = "pt-BR";
    const today = new Date();
    
    // Add current date offset to simulate next 9 days
    for (let i = 1; i <= 9; i++) {
      const nextDate = new Date();
      nextDate.setDate(today.getDate() + i);
      
      const weekday = nextDate.toLocaleDateString(locale, { weekday: "long" });
      const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
      
      // format: "Terça-feira, 16 de Junho"
      const dateString = nextDate.toLocaleDateString(locale, { day: "numeric", month: "long" });
      
      dates.push({
        rawDate: nextDate,
        weekday: capitalizedWeekday,
        dateFormatted: `${capitalizedWeekday.split("-")[0]}, ${dateString}`,
        key: nextDate.toISOString().split("T")[0]
      });
    }
    return dates;
  };

  const upcomingDates = getUpcomingDates();

  // Filter dates based on active doctor availability weekdays
  const availableDates = selectedDoctor 
    ? upcomingDates.filter(d => {
        // e.g. doc.availability is ["Segunda-feira", "Terca-feira"]
        // Strip suffixes to ease match, lowercasing both
        const matches = selectedDoctor.availability.some(day => {
          const availDayClean = day.toLowerCase().split("-")[0];
          const queryDayClean = d.weekday.toLowerCase().split("-")[0];
          return queryDayClean.includes(availDayClean) || availDayClean.includes(queryDayClean);
        });
        return matches;
      })
    : [];

  const handleSelectDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setPreselectedDoctorId(doctor.id);
    setStep(2);
  };

  const handleSelectDateAndHour = (date: string, hour: string) => {
    setSelectedDate(date);
    setSelectedTimeSlot(hour);
    setStep(3);
  };

  // Basic validation rules and final confirmation
  const handleConfirmReservation = (e: FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!patientName.trim()) {
      setFormError("Nome Completo é obrigatório.");
      return;
    }
    if (!patientPhone.trim() || patientPhone.trim().length < 8) {
      setFormError("Telefone/WhatsApp válido é obrigatório.");
      return;
    }
    if (!patientEmail.trim() || !patientEmail.includes("@")) {
      setFormError("Informe um endereço de e-mail válido.");
      return;
    }
    if (!patientCpf.trim()) {
      setFormError("O CPF é obrigatório para faturamento médico.");
      return;
    }

    // Generate random code for clinical assurance
    const randomCode = "SRC-" + Math.floor(1000 + Math.random() * 9000);

    const newAppointment: ScheduledAppointment = {
      id: Math.random().toString(36).substr(2, 9),
      doctorName: selectedDoctor!.name,
      doctorId: selectedDoctor!.id,
      doctorRole: selectedDoctor!.role,
      doctorImage: selectedDoctor!.image,
      specialtyName: selectedDoctor!.specialtyName,
      dateStr: selectedDate,
      timeSlot: selectedTimeSlot,
      patientName,
      patientPhone,
      patientEmail,
      paymentType,
      status: "active",
      code: randomCode
    };

    onAppointmentCreated(newAppointment);
    setBookingConfirmed(newAppointment);
    setStep(4);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedDoctor(null);
    setPreselectedDoctorId(null);
    setSelectedDate("");
    setSelectedTimeSlot("");
    setPatientName("");
    setPatientPhone("");
    setPatientEmail("");
    setPatientCpf("");
    setBookingConfirmed(null);
  };

  return (
    <div className="flex-grow max-w-4xl mx-auto px-4 py-8 sm:py-12 w-full" id="booking-stepper-container">
      
      {/* Title Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
          Agendamento de Consulta
        </h1>
        <p className="text-slate-500 text-xs mt-2">
          Siga os passos rápidos abaixo para agendar seu atendimento clínico no Instituto SerClin.
        </p>

        {/* Dynamic Step indicator */}
        {step < 4 && (
          <div className="flex items-center justify-center gap-2 mt-6 max-w-md mx-auto" id="stepper-gui">
            <div className={`h-2 flex-grow rounded-full transition-all duration-300 ${step >= 1 ? "bg-emerald-600" : "bg-slate-200"}`} />
            <span className="text-[10px] font-mono font-bold text-slate-400">PASSO {step} de 3</span>
            <div className={`h-2 flex-grow rounded-full transition-all duration-300 ${step >= 2 ? "bg-emerald-600" : "bg-slate-200"}`} />
            <div className={`h-2 flex-grow rounded-full transition-all duration-300 ${step >= 3 ? "bg-emerald-600" : "bg-slate-200"}`} />
          </div>
        )}
      </div>

      {/* STEP 1: Select doctor */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-100 flex items-center gap-3">
            <Stethoscope className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <p className="text-xs text-emerald-800 font-medium">
              Escolha um de nossos especialistas abaixo para prosseguir com a verificação de agenda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DOCTORS.map((doc) => (
              <div
                key={doc.id}
                onClick={() => handleSelectDoctor(doc)}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg shadow-sm cursor-pointer transition-all flex gap-4 items-center group"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                  <img src={doc.image} alt={doc.name} className="w-full h-full object-cover object-top" />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-800 leading-tight group-hover:text-emerald-600 transition-colors">{doc.name}</h3>
                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-500">{doc.specialtyName}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{doc.role}</p>
                  
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-mono mt-2">
                    <span>★ {doc.rating}</span>
                    <span className="text-slate-350">•</span>
                    <span className="text-slate-400 font-sans">{doc.availability[0]} e mais</span>
                  </div>
                </div>
                <div className="p-1 text-slate-300 group-hover:text-emerald-500 transition-colors">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: Pick Date & Hour */}
      {step === 2 && selectedDoctor && (
        <div className="space-y-6">
          
          {/* Back button */}
          <button
            onClick={() => { setStep(1); setPreselectedDoctorId(null); }}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors uppercase font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para Especialistas</span>
          </button>

          {/* Doctor Brief header */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
              <img src={selectedDoctor.image} alt={selectedDoctor.name} className="w-full h-full object-cover object-top" />
            </div>
            <div>
              <p className="text-[10px] font-bold font-mono tracking-wider text-emerald-600 uppercase">Profissional selecionado:</p>
              <h3 className="text-lg font-bold text-slate-800Leading font-sans leading-none">{selectedDoctor.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{selectedDoctor.role}</p>
            </div>
          </div>

          {/* Availability Details info */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Calendar className="w-4.5 h-4.5 text-emerald-600" />
              <span>1. Escolha o melhor dia:</span>
            </h4>
            
            {availableDates.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {availableDates.map((date) => (
                  <button
                    key={date.key}
                    onClick={() => { setSelectedDate(date.dateFormatted); setSelectedTimeSlot(""); }}
                    className={`p-3.5 rounded-xl border text-center transition-all ${
                      selectedDate === date.dateFormatted
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-100"
                        : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    <p className="text-xs font-bold uppercase tracking-wider font-mono opacity-80">{date.weekday.split("-")[0]}</p>
                    <p className="text-[13px] font-sans mt-0.5 font-semibold text-slate-800 block text-inherit">
                      {date.dateFormatted.split(",")[1]}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100">
                Não localizamos dias com agenda livre para este especialista nos próximos 9 dias.
              </p>
            )}
          </div>

          {/* Time Picker */}
          {selectedDate && (
            <div className="space-y-4 animate-fadeIn">
              <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Clock className="w-4.5 h-4.5 text-emerald-600" />
                <span>2. Disponibilidade de horários em {selectedDate}:</span>
              </h4>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {selectedDoctor.hours.map((hour) => (
                  <button
                    key={hour}
                    onClick={() => setSelectedTimeSlot(hour)}
                    className={`py-3.5 px-2 text-center rounded-xl font-semibold border transition-all text-xs ${
                      selectedTimeSlot === hour
                        ? "bg-slate-800 text-white border-slate-800 shadow-md"
                        : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    {hour}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Proceed to patient step */}
          {selectedDate && selectedTimeSlot && (
            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setStep(3)}
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl tracking-wide flex items-center gap-2 shadow-lg shadow-emerald-100 animate-pulse"
              >
                <span>Prosseguir para Dados</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      )}

      {/* STEP 3: Patient Form & Payment choice */}
      {step === 3 && selectedDoctor && (
        <div className="space-y-6">
          {/* Back to scheduler choice */}
          <button
            onClick={() => setStep(2)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors uppercase font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para Data e Hora</span>
          </button>

          {/* Brief header */}
          <div className="bg-slate-100 p-4 rounded-xl text-xs text-slate-600 flex justify-between gap-4">
            <div>
              <p className="font-bold">Especialista: <span className="text-slate-800">{selectedDoctor.name}</span></p>
              <p className="font-mono">{selectedDoctor.role}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-800">{selectedDate}</p>
              <p className="font-bold text-emerald-600 font-mono">Horário: {selectedTimeSlot}</p>
            </div>
          </div>

          {/* Error banner */}
          {formError && (
            <div className="bg-red-50 text-red-700 p-3.5 rounded-xl text-xs font-medium flex items-center gap-2 border border-red-100 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Main Patient Form */}
          <form onSubmit={handleConfirmReservation} className="space-y-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm" id="booking-fields">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100">
              <User className="w-4 h-4 text-emerald-600" />
              <span>Dados do Paciente</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 font-mono">Nome Completo:</label>
                <input
                  type="text"
                  placeholder="Nome do Paciente"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-sm transition-all"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 font-mono">Número do CPF:</label>
                <input
                  type="text"
                  placeholder="Ex: 000.000.000-00"
                  value={patientCpf}
                  onChange={(e) => setPatientCpf(e.target.value)}
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-sm transition-all"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 font-mono">Celular / WhatsApp:</label>
                <input
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-sm transition-all"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 font-mono">E-mail para lembrete:</label>
                <input
                  type="email"
                  placeholder="paciente@provedor.com"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-sm transition-all"
                  required
                />
              </div>
            </div>

            {/* Payment Method Option */}
            <div className="flex flex-col gap-2 pt-4">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>Forma de Tratamento / Convênio:</span>
              </label>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {["Particular", "Amil", "Bradesco", "Unimed", "Sulamérica", "Porto Seguro"].map((type) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => setPaymentType(type)}
                    className={`py-2.5 px-1.5 text-center text-xs rounded-lg border transition-all font-medium ${
                      paymentType === type
                        ? "bg-emerald-50 border-emerald-500 text-emerald-800 font-bold"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              
              <p className="text-[10px] text-slate-400 mt-1 font-mono tracking-tight leading-relaxed">
                * Para planos de saúde aceitos, realizamos faturamento direto ou auxiliamos na documentação para reembolso completo sem burocracia.
              </p>
            </div>

            {/* Form submit review */}
            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                id="btn-confirm-booking"
                className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl tracking-wide shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 transition-all scale-100 active:scale-95"
              >
                <span>Confirmar Agendamento</span>
                <CheckCircle className="w-5 h-5 text-emerald-200" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 4: SUCCESS REACTION SCREEN */}
      {step === 4 && bookingConfirmed && (
        <div className="bg-white p-8 rounded-3xl border border-emerald-50 shadow-xl text-center space-y-6 max-w-lg mx-auto animate-fadeIn" id="booking-success-box">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 text-[11px] font-bold font-mono tracking-wider uppercase rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CONSULTA CONFIRMADA</span>
            </div>
            <h2 className="text-2xl font-black text-slate-800 font-sans">Sua vaga está garantida!</h2>
            <p className="text-sm text-slate-500">
              Obrigado, <strong className="text-slate-805 text-slate-800">{bookingConfirmed.patientName}</strong>! Enviamos uma guia de preparo para o seu e-mail e nosso time entrará em contato via WhatsApp para confirmação do token da sala.
            </p>
          </div>

          {/* Booking Summary Box */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-150 text-left space-y-3 font-normal text-sm">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2.5">
              <span className="text-xs text-slate-400 font-mono">Código Localizador:</span>
              <strong className="font-mono text-emerald-700 uppercase">{bookingConfirmed.code}</strong>
            </div>

            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-250 bg-slate-200 flex-shrink-0">
                <img src={bookingConfirmed.doctorImage} alt={bookingConfirmed.doctorName} className="w-full h-full object-cover object-top" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">{bookingConfirmed.doctorName}</h4>
                <p className="text-slate-400 text-xs">{bookingConfirmed.doctorRole}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">Data Escolhida:</span>
                <p className="font-semibold text-slate-800 text-xs mt-0.5">{bookingConfirmed.dateStr}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">Hora Marcada:</span>
                <p className="font-bold text-emerald-600 text-xs mt-0.5">{bookingConfirmed.timeSlot} h</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-150">
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">Forma de Ingresso:</span>
              <p className="text-slate-700 text-xs mt-0.5 font-medium">{bookingConfirmed.paymentType}</p>
            </div>
          </div>

          {/* Bottom redirection */}
          <div className="pt-4 flex flex-col gap-2.5">
            <button
              onClick={() => setView("portal")}
              className="w-full py-3.5 bg-emerald-605 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl transition-all"
            >
              Ver minhas consultas no Painel
            </button>
            <button
              onClick={handleReset}
              className="w-full py-3.5 text-slate-500 hover:text-slate-800 text-xs font-semibold font-mono uppercase"
            >
              Agendar para outro familiar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
