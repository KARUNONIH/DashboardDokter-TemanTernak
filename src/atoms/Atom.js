import { atom } from "jotai";
export const sidebarAtom = atom(true);
export const profileDropdownAtom = atom(false);
export const notificationAtom = atom(false);
export const isModalOpenAtom = atom(false);
export const activeFeatureAtom = atom(0);
export const activeFormRegistrationAtom = atom("proggress0");
export const sessionSignAtom = atom(false);
export const navbarCollapseAtom = atom(false);
export const formSpecializationAtom = atom("specializations");
export const signupStatusAtom = atom(null);
export const errorSignupAtom = atom(null);
export const errorSignuSpecializationAtom = atom(null);
export const recentPatientAtom = atom("upcoming");
export const preSignupAtom = atom({ name: "", email: "", password: "" });
export const loginAtom = atom({ email: "", password: "" });
export const modalKonsultasiAtom = atom(false);
export const modalLayananAtom = atom(false);
export const responseApiAtom = atom(null);
export const loadingApiAtom = atom(true);
export const errorApiAtom = atom(null);
export const submittingPreSignupAtom = atom(false);
export const submittingLoginAtom = atom(false);
export const signupAtom = atom({ generalIdentity: { frontTitle: "", backTitle: "", dateOfBirth: "", whatsappNumber: "", formalPictureId: "", nik: "", ktpFileId: "", biodata: "" }, license: { strvFileId: "", strvValidUntil: "", strvNumber: "", sipFileId: "", sipValidUntil: "", sipNumber: "" }, specializations: [""], educations: [{ institution: "", year: "", program: "", title: "" }], workingExperiences: [{ institution: "", year: "", position: "", isActive: false }], organizationExperiences: [{ institution: "", year: "", position: "", isActive: false }], bankAndTax: { npwp: "", npwpFileId: "", bankName: "", bankAccountNumber: "", bankAccountName: "", bankAccountFileId: "" }, invitationId: "673638f3e7674c5dc40181a4" });
export const dataRegistrationUserAtom = atom({ generalIdentity: { frontTitle: "", backTitle: "", dateOfBirth: "", whatsappNumber: "", formalPictureId: "", nik: "", ktpFileId: "", biodata: "" }, license: { strvFileId: "", strvValidUntil: "", strvNumber: "", sipFileId: "", sipValidUntil: "", sipNumber: "" }, specializations: [""], educations: [{ institution: "", year: "", program: "", title: "" }], workingExperiences: [{ institution: "", year: "", position: "", isActive: false }], organizationExperiences: [{ institution: "", year: "", position: "", isActive: false }], bankAndTax: { npwp: "", npwpFileId: "", bankName: "", bankAccountNumber: "", bankAccountName: "", bankAccountFileId: "" }, invitationId: "673638f3e7674c5dc40181a4" });
export const fileSignup = atom(null);
export const fileNameSignupAtom = atom({ formalPictureId: "", ktpFileId: "", strvFileId: "", sipFileId: "", npwpFileId: "", bankAccountFileId: "" });
export const dataUSerAtom = atom({ id: "", name: "", email: "", createdAt: "", updatedAt: "", role: "", phone: "", username: "" });
export const settingMenuLayananAtom = atom({ activeMenu: "konsultasi" });
export const addServiceDataAtom = atom({ price: "", duration: "", description: "", name: "" });
export const editServiceDataAtom = atom({ id: "", price: "", duration: "", description: "", name: "" });
export const editServiceDataNoIdAtom = atom({ price: "", duration: "", description: "", name: "" });
export const dataLayananAtom = atom({ konsultasi: [], layanan: [], jadwal: [] });
export const filterDataLayananKonsultasiJadwalAtom = atom({ konsultasi: [], layanan: [], jadwal: [] });
export const typeModalLayananAtom = atom(null);
export const scheduleDataAtom = atom({ startTime: "", endTime: "" });
export const consultationDataCalendarAtom = atom([]);
export const bookingsDataAtom = atom([]);
export const lengthOfConsultationAtom = atom({ konsultasi: null, layanan: null, jadwal: null });
export const ConsultationDataDashboardAtom = atom([]);
export const newDataSignupAtom = atom({});
export const statusRegistationAtom = atom(false);
export const dataRiwayatAtom = atom([]);
export const errorLoginAtom = atom(null);
export const konsultasiTerkiniAtom = atom({ upcoming: [], done: [], });
export const filterDataRiwatAtom = atom([]);
export const lengthOfHistoryAtom = atom(null);
export const modalRiwayatAtom = atom(false);
export const dataIdModalRiwayat = atom(null);
export const dataModalKonsultasiAtom = atom([]);
export const allDataKonsultasiAtom = atom([]);
export const dataDashboardAtom = atom({});
