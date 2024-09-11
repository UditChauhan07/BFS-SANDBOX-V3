import { MdOutlineDownload } from "react-icons/md"
import AppLayout from "../../components/AppLayout"
import { useEffect, useState } from "react"
import ModalPage from "../../components/Modal UI";
import SelectBrandModel from "../../components/My Retailers/SelectBrandModel/SelectBrandModel";
import { useManufacturer } from "../../api/useManufacturer";
import Loading from "../../components/Loading";
import { generateBrandAuditTemplate, GetAuthData, getBrandAuditPaginate, originAPi } from "../../lib/store";
import { CloseButton } from "../../lib/svg";
import { getPermissions } from "../../lib/permission";
import { useNavigate } from "react-router-dom";
// Styling
const styles = {
    optionContainer: {
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
        flex: 1,
        transition: 'transform 0.3s ease',
    },
    optionTitle: {
        fontSize: '20px',
        marginBottom: '20px',
        textAlign: 'center',
    },
    chunkList: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '10px',
    },
    chunkButton: {
        position: 'relative',
        padding: '10px 15px',
        fontSize: '14px',
        color: '#fff',
        backgroundColor: '#444',
        border: '2px solid #333',
        borderRadius: '5px',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'background-color 0.3s ease, transform 0.3s ease',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    loader: {
        width: '12px',
        height: '12px',
        border: '2px solid #fff',
        borderTop: '2px solid #999',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    checkmark: {
        color: '#0f0',
        fontSize: '18px',
    },
    '@keyframes spin': {
        from: { transform: 'rotate(0deg)' },
        to: { transform: 'rotate(360deg)' },
    },
};

const AuditReport = () => {
    const [isShowBrandModal, setIsShowBrandModal] = useState(false);
    const { data: manufacturers, isLoading, error } = useManufacturer();
    const [isPdfGenerated, setIsPdfGenerated] = useState(false)
    const [brandSelect, setbrandSelected] = useState();
    const [brandStep, setBrandStep] = useState(0);
    const [brandPages, setBrandPages] = useState({ isLoaded: false, value: 0 });
    const [totalAccount,setTotalAccount]=useState();
    const [currentFileName, setCurrentFileName] = useState('');
    const [selectedSalesRepId, setSelectedSalesRepId] = useState();
    const [userData, setUserData] = useState({});
    const [hasPermission, setHasPermission] = useState(null);
    const navigate = useNavigate()
    const onCloseModal = () => {
        setBrandStep(0);
        setTotalAccount()
        setBrandPages({ isLoaded: false, value: 0 });
        setIsShowBrandModal(false);
        setIsPdfGenerated(false)
    }

    const BrandPaginateHanlder = (brand) => {
        setBrandStep(1);
        setbrandSelected(brand)
        if (!brand) {
            brand = brandSelect;
        }
        GetAuthData().then((user) => {
            getBrandAuditPaginate({ key: user.x_access_token, Ids: JSON.stringify([brand.Id]), }).then((data) => {
                let pages = Math.ceil(data.length / 10)
                // console.log({ pages });
                setTotalAccount(data.length)

                setBrandPages({ isLoaded: true, value: pages })
            }).catch((aErr) => {
                console.log({ aErr });
            })
        }).catch((userErr) => {
            console.log({ userErr });
        })
    }

    const ChunkedReportDownload = ({ chunks }) => {
        const [loadingChunk, setLoadingChunk] = useState(null);
        const [downloadedChunks, setDownloadedChunks] = useState([]);
        const [busyParts, setBusyParts] = useState([]);

        const onChangeHandler = async (page) => {
            // If a download is in progress, mark other parts as busy
            if (loadingChunk !== null && loadingChunk !== page) {
                if (!busyParts.includes(page)) {
                    setBusyParts((prev) => [...prev, page]);
                    setTimeout(() => {
                        setBusyParts((prev) => prev.filter((part) => part !== page));
                    }, 3000); // Show "Busy" message for 3 seconds
                }
                return;
            }

            setLoadingChunk(page);
            try {
                const user = await GetAuthData();
                const file = await generateBrandAuditTemplate({
                    key: user.x_access_token,
                    Ids: JSON.stringify([brandSelect.Id]),
                    currentPage: page
                });

                if (file) {
                    const a = document.createElement('a');
                    let fileName = `${brandSelect.Name}-Audit-Report-Part-${page}-${new Date().toISOString()}.pdf`.replaceAll(" ", "-");
                    a.href = `${originAPi}/files${file}/${fileName}/index`;
                    a.download = fileName;
                    a.click();
                    setDownloadedChunks((prev) => [...prev, page]);
                }
            } catch (error) {
                console.error('Error generating or downloading PDF:', error);
            } finally {
                // Ensure this runs regardless of success or failure
                setLoadingChunk(null);
            }
        };

  // Fetch user data and permissions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await GetAuthData();
        setUserData(user);

        if (!selectedSalesRepId) {
          setSelectedSalesRepId(user.Sales_Rep__c);
        }

        const userPermissions = await getPermissions();
        setHasPermission(userPermissions?.modules?.TopNav?.childModules?.auditReport);

        // If no permission, redirect to dashboard
        if (userPermissions?.modules?.TopNav?.childModules?.auditReport === false) {
          navigate("/dashboard");
        }
        
      } catch (error) {
        console.log({ error });
      }
    };
    
    fetchData();
  }, [navigate, selectedSalesRepId]);

  // Check permission and handle redirection
  useEffect(() => {
    if (hasPermission === false) {
      navigate("/dashboard");  // Redirect if no permission
    }
  }, [hasPermission, navigate]);

        return (
            <div style={styles.optionContainer}>
                <div style={styles.chunkList}>
                    {chunks.map((chunk, index) => {
                        const partNumber = index + 1;
                        const isBusy = busyParts.includes(partNumber);
                        const isDownloading = loadingChunk === partNumber;
                        const isDownloaded = downloadedChunks.includes(partNumber);

                        return (
                            <button
                                key={index}
                                style={styles.chunkButton}
                                onClick={() => onChangeHandler(partNumber)}
                                disabled={isDownloading || isBusy}
                            >
                                <span style={{ display: 'flex', alignItems: 'center' }}>
                                    {isDownloading && <div style={styles.loader}></div>}
                                    <span style={{ marginLeft: isDownloading ? '10px' : '0', display: 'flex' }}>
                                        {isDownloading
                                            ? 'Downloading...'
                                            : isBusy
                                                ? 'Busy, please try again later'
                                                : <><MdOutlineDownload size={16} className="m-auto" />&nbsp;{`Part ${partNumber}`}</>}
                                    </span>
                                </span>
                                {isDownloaded && (
                                    <span style={styles.checkmark}>&#10003;</span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Main UI component to compare both options
    const ReportDownloadComparison = () => {
        useEffect(() => {
            // Any side-effects based on brandPages can be handled here
        }, [brandPages]);
        const chunks = Array.from({ length: brandPages.value }, (_, i) => i + 1);

        return (
            <div style={styles.comparisonContainer}>
                {brandPages.isLoaded ?
                    chunks.length?<ChunkedReportDownload chunks={chunks} />:"Not Part Avalaible" :
                    <Loading height={'200px'} />}
            </div>
        );
    };


    const AuditForm = () => {
        useEffect(() => { }, [brandStep])
        return (
            <>
                {brandStep == 1 ?
                    <div className="p-[20px] max-w-[900px]">
                        <section>
                            <div className="d-flex align-items-center justify-content-between gap-5 mb-4">
                                <h3 className="font-[Montserrat-500] text-[22px] tracking-[2.20px] text-left">Download Audit Report for {brandSelect?.Name || 'NA'} in Parts</h3>
                                <button type="button" onClick={onCloseModal}>
                                    <CloseButton />
                                </button>
                            </div>
                            {brandPages.isLoaded?<small className="d-block w-[100%] text-right mb-2">Total Accounts: <b>{totalAccount}</b></small>:null}
                            <ReportDownloadComparison /></section></div>
                    : brandStep == 0 ?
                        <SelectBrandModel brands={manufacturers?.data} onChange={BrandPaginateHanlder} onClose={onCloseModal} />
                        :
                        null}
            </>
        )
    }

    return (<AppLayout
        filterNodes={<button className="border px-2 py-1 leading-tight d-flex" onClick={() => setIsShowBrandModal(true)}>

            <MdOutlineDownload size={16} className="m-auto" />
            <small style={{ fontSize: '9px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Brand <br />Report</small>
        </button>}>
        <ModalPage content={<AuditForm brandStep={brandStep} />} onClose={onCloseModal} open={isShowBrandModal} />
        {isLoading ? <Loading height={'40vh'} /> : <>
            {/* <div>
                <h2 className="font-['Arial-400'] text-[26px] tracking-[2.20px] text-left">
                    Audit Report
                </h2>
            </div> */}
            <div className="d-grid place-content-center min-h-[40vh]">
                {isPdfGenerated ? <><img src="https://i.giphy.com/7jtU9sxHNLZuv8HZCa.webp" width="480" height="480" /><p className="text-center mt-2">{`Creating PDF Audit Report for ${brandSelect?.Name}`}</p></> : <div className="col-12">
                    <p className="m-0 fs-2 font-[Montserrat-400] text-[14px] tracking-[2.20px]">Coming Soon...</p>
                </div>}

            </div></>}
    </AppLayout>)
}
export default AuditReport