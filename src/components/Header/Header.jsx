import React, { Component, memo } from "react";
import st from "./Header.module.css"
import back_arr from "../../images/back_arr.svg"
import { notifier } from '../../helpers/notify'
import ask_btn from "../../images/ask_btn.svg"

class Header extends Component {

  askBtn = () => {
    notifier('Як все працює? <br/> <br/>Спочатку створюємо команду. <br/><br/> Далі додаємо друзів, або запрошуємо через Телеграм чи надіславши URL-адресу.<br/><br/> Розіграти санту зможе тільки той, хто створив команду і тільки після того, як к-сть гравців буже більша 3-ьох <br/><br/> Сповіщення для кого готувати подарунок прийде на пошту, що Ви вказали.<br/> Якщо повідомлення немає - можете перевірити знову зайшовши на сторінку команди <br/><br/> Можна починати! <br/> <a id="mailLink" href="mailto: vvladbondarig@gmail.com">vvladbondarig@gmail.com</a>', true)
  }

  render() {
    // const { pathname } = this.props.location
    return <header>
      {/*{pathname !== '/' && <span to="/" className={st.back_link}><img src={back_arr} alt="Назад" /></span>}*/}
      <span className={st.logo}>Hangover calculator</span>
      <button onClick={this.askBtn} className={st.ask_btn}><img src={ask_btn} alt="?" /></button>
    </header>
  }
}

export default memo(Header);