import SignInForm from '@/components/web/SignInForm'
import SiteFooter from '@/components/web/Footer'

export default function SignInPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      <div className="flex-grow flex items-center justify-center w-full">
        <SignInForm />
      </div>

      <SiteFooter />
    </main>
  )
}
