import React from 'react'
import Icon from '../../components/Icon'
import MainMenu from '../../components/MainMenu'
import { useHistory } from 'react-router-dom'
import DesktopMenu from '../../components/DesktopMenu'
import localStorageService from '../../services/localStorageService'

import './style.css'

const Menu = () => {
	const history = useHistory()

	const onLogOut = () => {
		localStorageService.removeUser()
		history.push('/login')
	}

	const copyToClipboard1 = () => {
		const host = window.location.origin
		const pathname = history.location.pathname
		const sufix = '#was-ist-velobserver'

		const url = `${host}${pathname}${sufix}`
		navigator.clipboard.writeText(url)
	}

	const copyToClipboard2 = () => {
		const host = window.location.origin
		const pathname = history.location.pathname
		const sufix = '#wie-funktioniert-die-bewertung'

		const url = `${host}${pathname}${sufix}`
		navigator.clipboard.writeText(url)
	}

	const copyToClipboard3 = () => {
		const host = window.location.origin
		const pathname = history.location.pathname
		const sufix = '#was-kann-ich-tun'

		const url = `${host}${pathname}${sufix}`
		navigator.clipboard.writeText(url)
	}

	const copyToClipboard4 = () => {
		const host = window.location.origin
		const pathname = history.location.pathname
		const sufix = '#was-bedeuten-die-kriterien'

		const url = `${host}${pathname}${sufix}`
		navigator.clipboard.writeText(url)
	}

	const copyToClipboard5 = () => {
		const host = window.location.origin
		const pathname = history.location.pathname
		const sufix = '#was-macht-ihr-mit-meinen-bewertungen'

		const url = `${host}${pathname}${sufix}`
		navigator.clipboard.writeText(url)
	}

	const copyToClipboard6 = () => {
		const host = window.location.origin
		const pathname = history.location.pathname
		const sufix = '#warum-soll-ich-weitere-fragen-uber-mich-beantworten'

		const url = `${host}${pathname}${sufix}`
		navigator.clipboard.writeText(url)
	}

	const copyToClipboard7 = () => {
		const host = window.location.origin
		const pathname = history.location.pathname
		const sufix = '#wer-steht-hinter-velobserver'

		const url = `${host}${pathname}${sufix}`
		navigator.clipboard.writeText(url)
	}

	const copyToClipboard8 = () => {
		const host = window.location.origin
		const pathname = history.location.pathname
		const sufix = '#was-kann-ich-tun-um-euch'

		const url = `${host}${pathname}${sufix}`
		navigator.clipboard.writeText(url)
	}

	return (
		<div>
			<div className='Menu'>
				<div className='Menu__content'>
					<DesktopMenu />
					<img className='Menu__logo' src='./images/logo.svg' alt='Logo' />
					<a
						href='https://velobserver.ch/'
						target='_blank'
						rel='noreferrer'
						className='Menu__singleItem Menu__singleItem--middle'>
						<Icon name='home' />
						<div className='Menu__itemText'>VelObserver.ch</div>
					</a>
					{/* <div className='Menu__singleItem Menu__singleItem--middle'>
						<Icon name='profile' />
						<div className='Menu__itemText'>Profil bearbeiten</div>
					</div> */}
					<div onClick={onLogOut} className='Menu__singleItem'>
						<Icon name='logout' />
						<div className='Menu__itemText'>Logout</div>
					</div>
					<div>
						<h1 className='Menu__title'>VelObserver FAQ</h1>
						<ul className='Menu__mainList'>
							<li className='Menu__mainListItem'>
								<a href='#was-ist-velobserver'>Was ist VelObserver?</a>
							</li>
							<li className='Menu__mainListItem'>
								<a href='#wie-funktioniert-die-bewertung'>Wie funktioniert die Bewertung?</a>
							</li>
							<li className='Menu__mainListItem'>
								<a href='#was-bedeuten-die-kriterien'>Was bedeuten die Kriterien?</a>
							</li>
							<ul className='Menu__subList'>
								<li className='Menu__subListItem'>
									<a href='#sicherheit'>Sicherheit</a>
								</li>
								<li className='Menu__subListItem'>
									<a href='#konfliktfreiheit'>Konfliktfreiheit</a>
								</li>
								<li className='Menu__subListItem'>
									<a href='#attraktivitat'>Attraktivität</a>
								</li>
							</ul>
							<li className='Menu__mainListItem'>
								<a href='#was-kann-ich-tun'>
									Was kann ich tun, wenn ich mit einer <br />
									<span className='Menu__mainListItem--secondLine'>Bewertung nicht einverstanden bin?</span>
								</a>
							</li>
							<li className='Menu__mainListItem'>
								<a href='#was-macht-ihr-mit-meinen-bewertungen'>Was macht Ihr mit meinen Bewertungen?</a>
							</li>
							<li className='Menu__mainListItem'>
								<a href='#warum-soll-ich-weitere-fragen-uber-mich-beantworten'>
									Warum soll ich weitere Fragen <br />
									<span className='Menu__mainListItem--secondLine'>über mich beantworten?</span>
								</a>
							</li>
							<li className='Menu__mainListItem'>
								<a href='#wer-steht-hinter-velobserver'>Wer steht hinter VelObserver?</a>
							</li>
							<li className='Menu__mainListItem'>
								<a href='#was-kann-ich-tun-um-euch'>
									Was kann ich tun, um Euch zu <br />
									<span className='Menu__mainListItem--secondLine'>unterstützen?</span>
								</a>
							</li>
						</ul>
					</div>
					<div>
						<div id='was-ist-velobserver' className='Menu__subtitle'>
							<h2>Was ist VelObserver?</h2>
							<div onClick={copyToClipboard1} title='Copy to clipboard'>
								<Icon name='anchor' />
							</div>
						</div>
						<div className='Menu__description'>
							<p>
								VelObserver ist Plattform für die Bewertung der Velotauglichkeit von Städten. Gemeinsam mit Dir
								zeigen wir, wie gut das Veloroutennetz ist und wie es sich verändert. VelObserver wurde im Februar
								2021 lanciert und bietet die Bewertung zunächst für das geplante Vorzugsroutennetz der Stadt
								Zürich an. Damit schaffen wir die Grundlage, um die Umsetzung der Velorouten-Initiative (2020 mit
								70,5% Ja angenommen) zu überprüfen. Je aktiver die User bewerten, desto eher werden wir neue
								Strassen für die Bewertung freischalten.
							</p>
							<p>
								Das entscheidende Merkmal von VelObserver ist die subjektive Bewertung. Wir wollen wissen, wie Du
								die Velowege beurteilst. Die Standards, nach denen die Stadt Zürich bisher die Qualität
								beurteilte, hat mit der Realität auf der Strassen leider sehr wenig zu tun. Wir sind davon
								überzeugt: Der einzig gültige Massstab sind Velofahrer:innen selbst. Ihnen will VelObserver eine
								Stimme gehen.
							</p>
							<p>
								VelObserver ist mit anderen Schweizer Städten im Gespräch, um die Bewertung auch dort anbieten zu
								können.
							</p>
						</div>

						<div id='wie-funktioniert-die-bewertung' className='Menu__subtitle'>
							<h2>Wie funktioniert die Bewertung?</h2>
							<div onClick={copyToClipboard2} title='Copy to clipboard'>
								<Icon name='anchor' />
							</div>
						</div>
						<div className='Menu__description'>
							<p>
								Wir bieten zwei Bewertungsmethoden an, eine einfache Bewertung, die keine Vorkenntnisse benötigt,
								und eine detaillierte Bewertung, die eine differenzierte Beurteilung ermöglicht, aber etwas
								aufwändiger ist.
							</p>
							<h3>Bewertung</h3>
							<p>
								Wenn Du auf der Startseite auf «Jetzt Bewerten» klickst, kommst Du auf die einfache Bewertung. Du
								kannst Dir entweder zufällig ausgewählte Bilder anzeigen lassen oder ein Abschnitt auf unserer
								Karte auswählen. Wichtig: Für die Bewertung gibt es kein richtig oder falsch, sondern einzig Deine
								subjektive Wahrnehmung. Fühlst Du Dich sicher? Fährst Du hier gerne Velo? Oder findest Du es
								schwierig oder gar bedrohlich?
							</p>
							<h3>Detaillierte Bewertung</h3>
							<p>
								Von der einfachen Bewertung kannst Du auf den Expertenmodus wechseln. Hier kannst Du die
								Abschnitte anhand der VelObserver-Kriterien beurteilen. Diese detailliertere Bewertung ermöglicht
								es, die Schwächen eines bestimmten Abschnitts eindeutiger zu identifizieren und die Wirkung der
								baulichen Massnahmen besser zu verstehen.
							</p>
							<p>
								Unsere Kriterien unterscheiden die wichtigsten Merkmale, die aus einem Veloweg einen Veloweg
								machen, den jeder zwischen 8 und 80 Jahren benützen kann: Sicherheit, Konfliktfreiheit,
								Attraktivität. In folgenden Abschnitt erläutern wir die Kriterien. Hier gehts zu einem kurzen{' '}
								<a href='https://vimeo.com/652529665' target='_blank' rel='noreferrer'>
									Erklärvideo
								</a>
								.
							</p>
						</div>

						<div id='was-bedeuten-die-kriterien' className='Menu__subtitle'>
							<h2>Was bedeuten die Kriterien?</h2>
							<div onClick={copyToClipboard4} title='Copy to clipboard'>
								<Icon name='anchor' />
							</div>
						</div>
						<div className='Menu__description Menu__description--withSubmenu'>
							<p>
								Wir sind überzeugt, dass ein guter Veloweg drei Kriterien erfüllt: Er ist attraktiv, sicher und
								frei von Konflikten.
							</p>
							<h3 id='sicherheit'>Sicherheit</h3>
							<p>
								Fühlst Du Dich hier sicher? Nichts hält Menschen so stark von Velofahren ab wie Angst – die Angst
								zu stürzen, verletzt oder gar getötet zu werden. Den grössten Einfluss auf die subjektive und
								objektive Sicherheit hat die bauliche Abtrennung von anderen Verkehrsflächen.
							</p>
							<h3 id='konfliktfreiheit'>Konfliktfreiheit</h3>
							<p>
								Kommen sich hier verschiedene Nutzer:innen des öffentlichen Raums in die Quere? Der Platz in
								Städten beschränkt. Einige Bedürfnisse lassen sich gut kombinieren, andere nicht – zum Beispiel
								Verkehr und Spielplätze. Entscheidend für eine Velostadt ist, dass das Velofahren nicht durch
								andere Nutzungen beeinträchtigt wird und – das ist mindestens so wichtig – dass andere Menschen
								nicht durch den Veloverkehr benachteiligt oder gefährdet werden.
							</p>
							<h3 id='attraktivitat'>Attraktivität</h3>
							<p>
								Ist das ein Ort, an dem Du gerne Velofahren würdest? Das Velo ist in der Stadt das effizienteste,
								schnellste und zuverlässigste Fortbewegungsmittel. Doch damit es möglichst viele Menschen nutzen
								können, muss es eben auch angenehm sein. Angenehm wird es, wenn wir etwa zu zweit nebeneinander
								fahren und uns unterhalten können (wie Autofahrer übrigens) oder wenn die Velowege durch
								hochwertigen öffentlichen Raum führen.
							</p>
							<p>
								Die VelObserver-Kriterien sind eine Weiterentwicklung der Kriterien des{' '}
								<a
									href='https://www.crow.nl/publicaties/design-manual-for-bicycle-traffic'
									target='_blank'
									rel='noreferrer'>
									CROW Design manual for bicycle traffic
								</a>
								. CROW führt zwei weitere Kriterien – Direktheit und Kohäsion. Diese Kriterien beschreiben eine
								Eigenschaft des Netzes, nicht eines einzelnen Abschnitts, deshalb bieten wir diese Merkmale nicht
								zur Bewertung an. Wir beabsichtigen jedoch, diese Kriterien in Zunkunt anhand Eurer Daten zu
								berechnen.
							</p>
						</div>

						<div id='was-kann-ich-tun' className='Menu__subtitle'>
							<h2>Was kann ich tun, wenn ich mit einer Bewertung nicht einverstanden bin?</h2>
							<div onClick={copyToClipboard3} title='Copy to clipboard'>
								<Icon name='anchor' />
							</div>
						</div>
						<div className='Menu__description'>
							<p>
								Jede:r VelObserver:in hat eine eigene Wahrnehmung – deshalb dürfen und sollen sich die Bewertungen
								auch unterscheiden. Wenn Du glaubst, andere User seien zu grosszügig oder zu streng, dann bewerte
								am besten selbst. Wenn Du der Meinung bist, die Bewertung eines bestimmten Abschnitts sei
								fehlerhaft oder manipuliert, dann schicke uns ein Mail.
							</p>
						</div>

						<div id='was-macht-ihr-mit-meinen-bewertungen' className='Menu__subtitle'>
							<h2>Was macht Ihr mit meinen Bewertungen?</h2>
							<div onClick={copyToClipboard5} title='Copy to clipboard'>
								<Icon name='anchor' />
							</div>
						</div>
						<div className='Menu__description'>
							<ol>
								<li>
									Deine Bewertungen fliessen in den VelObserver-Index – die visuelle Darstellung sämtlicher
									Bewertungen auf einer Karte und in Charts. Damit trägst Du dazu bei, die Velotauglichkeit von
									Zürich sichtbar zu machen.
								</li>
								<li>
									Wir werden diese Daten regelmässig auswerten und in unserem Blog über die relevanten
									Ergebnisse berichten.
								</li>
								<li>
									Wir erstellen Analysen der Bewertungen und stellen sie Verkehrspolitikern und Fachleuten zur
									Verfügung, die Argumente für die Verbesserung der Velowege benötigen.
								</li>
								<li>
									Wir liefern der Verwaltung jährlich einen umfassenden Bericht mit allen wichtigen Auswertungen
									der User-Bewertungen.
								</li>
							</ol>
						</div>

						<div id='warum-soll-ich-weitere-fragen-uber-mich-beantworten' className='Menu__subtitle'>
							<h2>Warum soll ich weitere Fragen über mich beantworten?</h2>
							<div onClick={copyToClipboard6} title='Copy to clipboard'>
								<Icon name='anchor' />
							</div>
						</div>
						<div className='Menu__description'>
							<p>
								Nach der Registrierung haben wir Dich um die Beantwortung einiger Fragen gebeten. Dieser
								Fragebogen ist fakultativ, aber es hilft uns enorm, wenn Du ihn ausfüllst. Warum? Entscheidend für
								eine Velostadt ist, dass sie niemanden von Velofahren ausschliesst. Für Kinder, Senioren oder
								wenig geübte Personen ist es praktisch unmöglich, in der Stadt Zürich Velozufahren – doch genau
								auf diese Bevölkerungsgruppen muss sich das künftige Veloroutennetz ausrichten, damit mehr Velo
								gefahren wird. Damit wir zeigen können, welche Velowege nur für die mutigen und versierten
								Velofahrer funktionieren und welche für alle, müssen wir möglichst viel über unsere
								VelObserver:innen wissen.
							</p>
						</div>

						<div id='wer-steht-hinter-velobserver' className='Menu__subtitle'>
							<h2>Wer steht hinter VelObserver?</h2>
							<div onClick={copyToClipboard7} title='Copy to clipboard'>
								<Icon name='anchor' />
							</div>
						</div>
						<div className='Menu__description'>
							<p>
								VelObserver ist ein Projekt der Mobilitätsgenossenschaft Posmo, das im Februar 2021 ins Leben
								gerufen wurde. Das VelObserver-Team besteht derzeit aus sieben Personen aus den Disziplinen
								Verkehrsplanung, IT, UX-Design und Kommunikation. Bis zum letzten Spätsommer verrichteten wir
								sämtliche Arbeit unentgeltlich, seit dem vergangenen Spätsommer ermöglicht uns eine Finanzierung
								des Prototype-Fund die Entwicklung eines Prototypen.
							</p>
							<p>
								Posmo und VelObserver sind politisch unabhängig und erhalten weder vom Staat noch von politischen
								Parteien finanzielle Unterstützung.
							</p>
						</div>

						<div id='was-kann-ich-tun-um-euch' className='Menu__subtitle'>
							<h2>Was kann ich tun, um Euch zu unterstützen?</h2>
							<div onClick={copyToClipboard8} title='Copy to clipboard'>
								<Icon name='anchor' />
							</div>
						</div>
						<div className='Menu__description'>
							<p>
								Dass Du diesen Abschnitt liest, freut uns besonders. Hier fünf Vorschläge, wie Du uns helfen
								kannst:
							</p>
							<ol>
								<li>Bewerte Velowege.</li>
								<li>Mobilisiere Deine Freunde und Familie, Routen zu bewerten.</li>
								<li>Werde Mitglied der Mobilitätsgenossenschaft Posmo.</li>
								<li>Spende uns eine Beitrag zur Weiterentwicklung von VelObserver, z. B. via Twint.</li>
								<li>
									Schicke uns eine Nachricht via Email, Twitter oder Linkedin. Über Lob freuen wir uns – Kritik
									wird uns helfen, VelObserver zu verbessern.
								</li>
							</ol>
						</div>
					</div>
				</div>
			</div>
			<MainMenu />
		</div>
	)
}

export default Menu
