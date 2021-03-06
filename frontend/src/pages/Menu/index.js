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
									<a href='#attraktivitat'>Attraktivit??t</a>
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
									<span className='Menu__mainListItem--secondLine'>??ber mich beantworten?</span>
								</a>
							</li>
							<li className='Menu__mainListItem'>
								<a href='#wer-steht-hinter-velobserver'>Wer steht hinter VelObserver?</a>
							</li>
							<li className='Menu__mainListItem'>
								<a href='#was-kann-ich-tun-um-euch'>
									Was kann ich tun, um Euch zu <br />
									<span className='Menu__mainListItem--secondLine'>unterst??tzen?</span>
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
								VelObserver ist Plattform f??r die Bewertung der Velotauglichkeit von St??dten. Gemeinsam mit Dir
								zeigen wir, wie gut das Veloroutennetz ist und wie es sich ver??ndert. VelObserver wurde im Februar
								2021 lanciert und bietet die Bewertung zun??chst f??r das geplante Vorzugsroutennetz der Stadt
								Z??rich an. Damit schaffen wir die Grundlage, um die Umsetzung der Velorouten-Initiative (2020 mit
								70,5% Ja angenommen) zu ??berpr??fen. Je aktiver die User bewerten, desto eher werden wir neue
								Strassen f??r die Bewertung freischalten.
							</p>
							<p>
								Das entscheidende Merkmal von VelObserver ist die subjektive Bewertung. Wir wollen wissen, wie Du
								die Velowege beurteilst. Die Standards, nach denen die Stadt Z??rich bisher die Qualit??t
								beurteilte, hat mit der Realit??t auf der Strassen leider sehr wenig zu tun. Wir sind davon
								??berzeugt: Der einzig g??ltige Massstab sind Velofahrer:innen selbst. Ihnen will VelObserver eine
								Stimme gehen.
							</p>
							<p>
								VelObserver ist mit anderen Schweizer St??dten im Gespr??ch, um die Bewertung auch dort anbieten zu
								k??nnen.
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
								Wir bieten zwei Bewertungsmethoden an, eine einfache Bewertung, die keine Vorkenntnisse ben??tigt,
								und eine detaillierte Bewertung, die eine differenzierte Beurteilung erm??glicht, aber etwas
								aufw??ndiger ist.
							</p>
							<h3>Bewertung</h3>
							<p>
								Wenn Du auf der Startseite auf ??Jetzt Bewerten?? klickst, kommst Du auf die einfache Bewertung. Du
								kannst Dir entweder zuf??llig ausgew??hlte Bilder anzeigen lassen oder ein Abschnitt auf unserer
								Karte ausw??hlen. Wichtig: F??r die Bewertung gibt es kein richtig oder falsch, sondern einzig Deine
								subjektive Wahrnehmung. F??hlst Du Dich sicher? F??hrst Du hier gerne Velo? Oder findest Du es
								schwierig oder gar bedrohlich?
							</p>
							<h3>Detaillierte Bewertung</h3>
							<p>
								Von der einfachen Bewertung kannst Du auf den Expertenmodus wechseln. Hier kannst Du die
								Abschnitte anhand der VelObserver-Kriterien beurteilen. Diese detailliertere Bewertung erm??glicht
								es, die Schw??chen eines bestimmten Abschnitts eindeutiger zu identifizieren und die Wirkung der
								baulichen Massnahmen besser zu verstehen.
							</p>
							<p>
								Unsere Kriterien unterscheiden die wichtigsten Merkmale, die aus einem Veloweg einen Veloweg
								machen, den jeder zwischen 8 und 80 Jahren ben??tzen kann: Sicherheit, Konfliktfreiheit,
								Attraktivit??t. In folgenden Abschnitt erl??utern wir die Kriterien. Hier gehts zu einem kurzen{' '}
								<a href='https://vimeo.com/652529665' target='_blank' rel='noreferrer'>
									Erkl??rvideo
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
								Wir sind ??berzeugt, dass ein guter Veloweg drei Kriterien erf??llt: Er ist attraktiv, sicher und
								frei von Konflikten.
							</p>
							<h3 id='sicherheit'>Sicherheit</h3>
							<p>
								F??hlst Du Dich hier sicher? Nichts h??lt Menschen so stark von Velofahren ab wie Angst ??? die Angst
								zu st??rzen, verletzt oder gar get??tet zu werden. Den gr??ssten Einfluss auf die subjektive und
								objektive Sicherheit hat die bauliche Abtrennung von anderen Verkehrsfl??chen.
							</p>
							<h3 id='konfliktfreiheit'>Konfliktfreiheit</h3>
							<p>
								Kommen sich hier verschiedene Nutzer:innen des ??ffentlichen Raums in die Quere? Der Platz in
								St??dten beschr??nkt. Einige Bed??rfnisse lassen sich gut kombinieren, andere nicht ??? zum Beispiel
								Verkehr und Spielpl??tze. Entscheidend f??r eine Velostadt ist, dass das Velofahren nicht durch
								andere Nutzungen beeintr??chtigt wird und ??? das ist mindestens so wichtig ??? dass andere Menschen
								nicht durch den Veloverkehr benachteiligt oder gef??hrdet werden.
							</p>
							<h3 id='attraktivitat'>Attraktivit??t</h3>
							<p>
								Ist das ein Ort, an dem Du gerne Velofahren w??rdest? Das Velo ist in der Stadt das effizienteste,
								schnellste und zuverl??ssigste Fortbewegungsmittel. Doch damit es m??glichst viele Menschen nutzen
								k??nnen, muss es eben auch angenehm sein. Angenehm wird es, wenn wir etwa zu zweit nebeneinander
								fahren und uns unterhalten k??nnen (wie Autofahrer ??brigens) oder wenn die Velowege durch
								hochwertigen ??ffentlichen Raum f??hren.
							</p>
							<p>
								Die VelObserver-Kriterien sind eine Weiterentwicklung der Kriterien des{' '}
								<a
									href='https://www.crow.nl/publicaties/design-manual-for-bicycle-traffic'
									target='_blank'
									rel='noreferrer'>
									CROW Design manual for bicycle traffic
								</a>
								. CROW f??hrt zwei weitere Kriterien ??? Direktheit und Koh??sion. Diese Kriterien beschreiben eine
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
								Jede:r VelObserver:in hat eine eigene Wahrnehmung ??? deshalb d??rfen und sollen sich die Bewertungen
								auch unterscheiden. Wenn Du glaubst, andere User seien zu grossz??gig oder zu streng, dann bewerte
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
									Deine Bewertungen fliessen in den VelObserver-Index ??? die visuelle Darstellung s??mtlicher
									Bewertungen auf einer Karte und in Charts. Damit tr??gst Du dazu bei, die Velotauglichkeit von
									Z??rich sichtbar zu machen.
								</li>
								<li>
									Wir werden diese Daten regelm??ssig auswerten und in unserem Blog ??ber die relevanten
									Ergebnisse berichten.
								</li>
								<li>
									Wir erstellen Analysen der Bewertungen und stellen sie Verkehrspolitikern und Fachleuten zur
									Verf??gung, die Argumente f??r die Verbesserung der Velowege ben??tigen.
								</li>
								<li>
									Wir liefern der Verwaltung j??hrlich einen umfassenden Bericht mit allen wichtigen Auswertungen
									der User-Bewertungen.
								</li>
							</ol>
						</div>

						<div id='warum-soll-ich-weitere-fragen-uber-mich-beantworten' className='Menu__subtitle'>
							<h2>Warum soll ich weitere Fragen ??ber mich beantworten?</h2>
							<div onClick={copyToClipboard6} title='Copy to clipboard'>
								<Icon name='anchor' />
							</div>
						</div>
						<div className='Menu__description'>
							<p>
								Nach der Registrierung haben wir Dich um die Beantwortung einiger Fragen gebeten. Dieser
								Fragebogen ist fakultativ, aber es hilft uns enorm, wenn Du ihn ausf??llst. Warum? Entscheidend f??r
								eine Velostadt ist, dass sie niemanden von Velofahren ausschliesst. F??r Kinder, Senioren oder
								wenig ge??bte Personen ist es praktisch unm??glich, in der Stadt Z??rich Velozufahren ??? doch genau
								auf diese Bev??lkerungsgruppen muss sich das k??nftige Veloroutennetz ausrichten, damit mehr Velo
								gefahren wird. Damit wir zeigen k??nnen, welche Velowege nur f??r die mutigen und versierten
								Velofahrer funktionieren und welche f??r alle, m??ssen wir m??glichst viel ??ber unsere
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
								VelObserver ist ein Projekt der Mobilit??tsgenossenschaft Posmo, das im Februar 2021 ins Leben
								gerufen wurde. Das VelObserver-Team besteht derzeit aus sieben Personen aus den Disziplinen
								Verkehrsplanung, IT, UX-Design und Kommunikation. Bis zum letzten Sp??tsommer verrichteten wir
								s??mtliche Arbeit unentgeltlich, seit dem vergangenen Sp??tsommer erm??glicht uns eine Finanzierung
								des Prototype-Fund die Entwicklung eines Prototypen.
							</p>
							<p>
								Posmo und VelObserver sind politisch unabh??ngig und erhalten weder vom Staat noch von politischen
								Parteien finanzielle Unterst??tzung.
							</p>
						</div>

						<div id='was-kann-ich-tun-um-euch' className='Menu__subtitle'>
							<h2>Was kann ich tun, um Euch zu unterst??tzen?</h2>
							<div onClick={copyToClipboard8} title='Copy to clipboard'>
								<Icon name='anchor' />
							</div>
						</div>
						<div className='Menu__description'>
							<p>
								Dass Du diesen Abschnitt liest, freut uns besonders. Hier f??nf Vorschl??ge, wie Du uns helfen
								kannst:
							</p>
							<ol>
								<li>Bewerte Velowege.</li>
								<li>Mobilisiere Deine Freunde und Familie, Routen zu bewerten.</li>
								<li>Werde Mitglied der Mobilit??tsgenossenschaft Posmo.</li>
								<li>Spende uns eine Beitrag zur Weiterentwicklung von VelObserver, z. B. via Twint.</li>
								<li>
									Schicke uns eine Nachricht via Email, Twitter oder Linkedin. ??ber Lob freuen wir uns ??? Kritik
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
