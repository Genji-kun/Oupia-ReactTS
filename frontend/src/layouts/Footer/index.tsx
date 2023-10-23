import { Footer as TailwindFooter } from 'flowbite-react'
import { BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitter } from 'react-icons/bs'
import logo from '../../assets/logo.svg'
import { useLocation } from 'react-router-dom';

const Footer: React.FC = () => {

    const location = useLocation();
    const bgTrans = (location.pathname === '/login' ||
        location.pathname.includes('/messages') || location.pathname.includes('/manager'));

    return (<>
        <div className={`${bgTrans ? 'hidden' : ''} border-t-2 border-gray-100 mt-5`}>
            <TailwindFooter container>
                <div className="w-full">
                    <div className="grid w-full md:w-auto flex-wrap justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
                        <div className="text-lg font-bold">
                            <TailwindFooter.Brand
                                alt="Oupia logo"
                                name="Oupia"
                                href="#"
                                src={logo}
                            />
                        </div>
                        <div className="sm:w-full md:w-auto grid grid-cols-1 gap-8 sm:mt-4 sm:grid-cols-1 md:grid-cols-3 sm:gap-6">
                            <div>
                                <TailwindFooter.Title title="about" />
                                <TailwindFooter.LinkGroup col>
                                    <TailwindFooter.Link href="#">
                                        Oupia
                                    </TailwindFooter.Link>
                                    <TailwindFooter.Link href="#">
                                        Tailwind CSS
                                    </TailwindFooter.Link>
                                </TailwindFooter.LinkGroup>
                            </div>
                            <div>
                                <TailwindFooter.Title title="Follow us" />
                                <TailwindFooter.LinkGroup col>
                                    <TailwindFooter.Link href="#">
                                        Github
                                    </TailwindFooter.Link>
                                    <TailwindFooter.Link href="#">
                                        Discord
                                    </TailwindFooter.Link>
                                </TailwindFooter.LinkGroup>
                            </div>
                            <div>
                                <TailwindFooter.Title title="Legal" />
                                <TailwindFooter.LinkGroup col>
                                    <TailwindFooter.Link href="#">
                                        Privacy Policy
                                    </TailwindFooter.Link>
                                    <TailwindFooter.Link href="#">
                                        Terms & Conditions
                                    </TailwindFooter.Link>
                                </TailwindFooter.LinkGroup>
                            </div>
                        </div>
                    </div>
                    <TailwindFooter.Divider />
                    <div className="w-full sm:flex sm:items-center sm:justify-between">
                        <TailwindFooter.Copyright
                            by="Oupia™"
                            href="#"
                            year={2023}
                        />
                        <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
                            <TailwindFooter.Icon
                                href="#"
                                icon={BsFacebook}
                            />
                            <TailwindFooter.Icon
                                href="#"
                                icon={BsInstagram}
                            />
                            <TailwindFooter.Icon
                                href="#"
                                icon={BsTwitter}
                            />
                            <TailwindFooter.Icon
                                href="#"
                                icon={BsGithub}
                            />
                            <TailwindFooter.Icon
                                href="#"
                                icon={BsDribbble}
                            />
                        </div>
                    </div>
                </div>
            </TailwindFooter>
        </div>
    </>);
};

export default Footer;